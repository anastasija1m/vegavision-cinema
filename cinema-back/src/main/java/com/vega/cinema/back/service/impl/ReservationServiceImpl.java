package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.ReservationCreateDto;
import com.vega.cinema.back.dto.SeatDto;
import com.vega.cinema.back.exception.QRCodeGenerationException;
import com.vega.cinema.back.exception.SeatAlreadyReservedException;
import com.vega.cinema.back.exception.handlers.EmailNotSentException;
import com.vega.cinema.back.model.MovieScreening;
import com.vega.cinema.back.model.Reservation;
import com.vega.cinema.back.model.ReservedSeat;
import com.vega.cinema.back.model.User;
import com.vega.cinema.back.repository.MovieScreeningRepository;
import com.vega.cinema.back.repository.ReservationRepository;
import com.vega.cinema.back.repository.UserRepository;
import com.vega.cinema.back.service.ReservationService;
import com.vega.cinema.back.util.EmailSender;
import com.vega.cinema.back.util.Mapper;
import com.vega.cinema.back.util.QRCodeGenerator;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        if (qrCodeByteArray != null) {
            String registrationSubject = "Details about your reservation.";
            String registrationMessage = "Scan the QR code to be able to see details about your reservation.";
            try {
                emailSender.sendEmailWithAttachment(email, registrationSubject, registrationMessage, qrCodeByteArray, "reservation_qr_code.png");
            } catch (MessagingException e) {
                throw new EmailNotSentException("Error sending email with attachment" + e);
            }
        } else {
            throw new QRCodeGenerationException("Failed to generate QR code for reservation.");
        }
    }

    private Reservation setReservationData(ReservationCreateDto reservationCreateDto, MovieScreening movieScreening) {
        Reservation reservation = new Reservation();
        Optional<User> user = userRepository.findByEmail(reservationCreateDto.getUserEmail());

        double totalPrice = movieScreening.getTicketPrice() * reservationCreateDto.getReservedSeats().size();
        if(user.isPresent())
            totalPrice *= 0.95;

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
    public List<ReservedSeat> getAllReservedSeatsForScreening(Long screeningId) {
        List<Reservation> reservations = reservationRepository.findReservationsByScreeningId(screeningId);

        List<ReservedSeat> reservedSeats = new ArrayList<>();
        for (Reservation reservation : reservations) {
            reservedSeats.addAll(reservation.getReservedSeats());
        }

        return reservedSeats;
    }
}