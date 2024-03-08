package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.MyReservationsGetDto;
import com.vega.cinema.back.dto.ReservationCreateDto;
import com.vega.cinema.back.dto.ReservationGetDto;
import com.vega.cinema.back.dto.SeatDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReservationService {

    ReservationCreateDto reserve(ReservationCreateDto reservationCreateDto);
    List<SeatDto> getAllReservedSeatsForScreening(Long screeningId);
    Page<MyReservationsGetDto> findAllForUserPaged(Long userId, Pageable pageable, String type);
    ReservationGetDto cancel(Long id);
}