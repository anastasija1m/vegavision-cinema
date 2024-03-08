package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.*;
import com.vega.cinema.back.exception.QRCodeGenerationException;
import com.vega.cinema.back.exception.ReservationAlreadyCancelledException;
import com.vega.cinema.back.exception.ScreeningAlreadyPassedException;
import com.vega.cinema.back.exception.SeatAlreadyReservedException;
import com.vega.cinema.back.exception.handlers.EmailNotSentException;
import com.vega.cinema.back.model.*;
import com.vega.cinema.back.repository.*;
import com.vega.cinema.back.service.ReservationService;
import com.vega.cinema.back.util.*;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final MovieScreeningRepository movieScreeningRepository;
    private final UserRepository userRepository;
    private final EmailSender emailSender;
    private final Mapper mapper;

    @Override
    public ReservationCreateDto reserve(ReservationCreateDto reservationCreateDto) {
        MovieScreening movieScreening = movieScreeningRepository.findById(reservationCreateDto.getScreeningId())
                .orElseThrow(() -> new EntityNotFoundException(String.format("Movie screening with id %d not found", reservationCreateDto.getScreeningId())));

        LocalDateTime currentDateTime = LocalDateTime.now();
        if (movieScreening.getScreeningDate().isBefore(currentDateTime)) {
            throw new ScreeningAlreadyPassedException("Movie screening has already passed");
        }

        for (SeatDto seatDto : reservationCreateDto.getReservedSeats()) {
            if (reservationRepository.existsByReservedSeat(
                    reservationCreateDto.getScreeningId(), seatDto.getSeatRow(), seatDto.getSeatColumn())) {
                throw new SeatAlreadyReservedException(seatDto.getSeatRow(), seatDto.getSeatColumn(), movieScreening.getMovie().getName());
            }
        }

        Reservation reservation = setReservationData(reservationCreateDto, movieScreening);
        reservationRepository.save(reservation);
        byte[] qrCode = generateQRCode(reservation);
        sendEmailWithQRCode(reservationCreateDto.getUserEmail(), qrCode);

        return mapper.map(reservation, ReservationCreateDto.class);
    }

    private byte[] generateQRCode(Reservation reservation) {
        return QRCodeGenerator.generateReservationQRCode(reservation);
    }

    @Async
    public void sendEmailWithQRCode(String email, byte[] qrCodeByteArray) {
        if(qrCodeByteArray == null)
            throw new QRCodeGenerationException("Failed to generate QR code for reservation.");

        String registrationSubject = "Details about your reservation.";
        String registrationMessage = "Scan the QR code to be able to see details about your reservation.";
        try {
            emailSender.sendEmailWithAttachment(email, registrationSubject, registrationMessage, qrCodeByteArray, "reservation_qr_code.png");
        } catch (MessagingException e) {
            throw new EmailNotSentException("Error sending email with attachment" + e);
        }
    }

    private Reservation setReservationData(ReservationCreateDto reservationCreateDto, MovieScreening movieScreening) {
        Reservation reservation = new Reservation();
        Optional<User> user = userRepository.findByEmail(reservationCreateDto.getUserEmail());

        double totalPrice = movieScreening.getTicketPrice() * reservationCreateDto.getReservedSeats().size();
        if(user.isPresent())
            reservation.setDiscountPercent(5);

        reservation.setTotalPrice(totalPrice);
        reservation.setUserEmail(reservationCreateDto.getUserEmail());
        reservation.setScreeningId(reservationCreateDto.getScreeningId());
        reservation.setIsCancelled(false);
        reservation.setCode(UUID.randomUUID().toString());

        List<ReservedSeat> reservedSeats = new ArrayList<>();
        for (SeatDto seatDto : reservationCreateDto.getReservedSeats()) {
            ReservedSeat reservedSeat = new ReservedSeat();
            reservedSeat.setSeatRow(seatDto.getSeatRow());
            reservedSeat.setSeatColumn(seatDto.getSeatColumn());
            reservedSeat.setReservation(reservation);
            reservedSeats.add(reservedSeat);
        }
        reservation.setReservedSeats(reservedSeats);

        return reservation;
    }

    @Override
    public List<SeatDto> getAllReservedSeatsForScreening(Long screeningId) {
        List<Reservation> reservations = reservationRepository.findReservationsByScreeningId(screeningId);

        List<ReservedSeat> reservedSeats = new ArrayList<>();
        for (Reservation reservation : reservations) {
            reservedSeats.addAll(reservation.getReservedSeats());
        }

        return mapper.mapList(reservedSeats, SeatDto.class);
    }

    @Override
    public Page<MyReservationsGetDto> findAllForUserPaged(Long userId, Pageable pageable, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        LocalDateTime now = LocalDateTime.now();
        Page<Object[]> reservationsPage = reservationRepository.findAllForUserPagedWithMovieAndScreening(user.getEmail(), now, type, pageable);

        List<MyReservationsGetDto> reservationDtos = reservationsPage.getContent().stream()
                .map(result -> {
                    Reservation reservation = (Reservation) result[0];
                    MovieScreening movieScreening = (MovieScreening) result[1];
                    Movie movie = (Movie) result[2];

                    MyReservationsGetDto reservationDto = mapper.map(reservation, MyReservationsGetDto.class);
                    ScreeningReservationGetDto screeningDto = mapper.map(movieScreening, ScreeningReservationGetDto.class);
                    MovieGetDto movieDto = mapper.map(movie, MovieGetDto.class);

                    screeningDto.setMovieGetDto(movieDto);
                    reservationDto.setMovieScreeningGetDto(screeningDto);

                    return reservationDto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(reservationDtos, pageable, reservationsPage.getTotalElements());
    }

    @Override
    public ReservationGetDto cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Reservation with id %s not found", id)));

        if(reservation.getIsCancelled())
            throw new ReservationAlreadyCancelledException(String.format("Reservation with id %s already cancelled", id));

        reservation.setIsCancelled(true);
        reservationRepository.save(reservation);

        return mapper.map(reservation, ReservationGetDto.class);
    }
}