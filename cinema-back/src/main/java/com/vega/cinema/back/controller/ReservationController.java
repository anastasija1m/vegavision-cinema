package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.ReservationCreateDto;
import com.vega.cinema.back.model.ReservedSeat;
import com.vega.cinema.back.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reservations")
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> reserve(@RequestBody ReservationCreateDto reservationCreateDto) {
        ReservationCreateDto createdReservation = reservationService.reserve(reservationCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }

    @GetMapping("/{screeningId}/reserved")
    public ResponseEntity<List<ReservedSeat>> getAllReservedSeatsForScreening(@PathVariable Long screeningId) {
        List<ReservedSeat> reservedSeats = reservationService.getAllReservedSeatsForScreening(screeningId);
        return ResponseEntity.ok(reservedSeats);
    }
}