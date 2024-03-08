package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.MyReservationsGetDto;
import com.vega.cinema.back.dto.ReservationCreateDto;
import com.vega.cinema.back.dto.ReservationGetDto;
import com.vega.cinema.back.dto.SeatDto;
import com.vega.cinema.back.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reservations")
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/{userId}")
    public ResponseEntity<Page<MyReservationsGetDto>> findAllForUserPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "future") String type) {

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<MyReservationsGetDto> result = reservationService.findAllForUserPaged(userId, pageRequest, type);

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> reserve(@RequestBody ReservationCreateDto reservationCreateDto) {
        ReservationCreateDto createdReservation = reservationService.reserve(reservationCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }

    @GetMapping("/{screeningId}/reserved")
    public ResponseEntity<List<SeatDto>> getAllReservedSeatsForScreening(@PathVariable Long screeningId) {
        List<SeatDto> reservedSeats = reservationService.getAllReservedSeatsForScreening(screeningId);
        return ResponseEntity.ok(reservedSeats);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReservationGetDto> cancel(@PathVariable Long id) {
        ReservationGetDto cancelledReservation = reservationService.cancel(id);
        return ResponseEntity.ok(cancelledReservation);
    }
}