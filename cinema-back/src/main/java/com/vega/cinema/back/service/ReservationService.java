package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.ReservationCreateDto;
import com.vega.cinema.back.model.ReservedSeat;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReservationService {

    ReservationCreateDto reserve(ReservationCreateDto reservationCreateDto);
    List<ReservedSeat> getAllReservedSeatsForScreening(Long screeningId);
}