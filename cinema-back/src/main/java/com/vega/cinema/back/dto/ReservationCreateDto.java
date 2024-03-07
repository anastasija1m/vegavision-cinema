package com.vega.cinema.back.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class ReservationCreateDto {

    @NotEmpty(message = "User email is required.")
    private String userEmail;

    @NotEmpty(message = "Screening information is required.")
    private Long screeningId;

    @NotEmpty(message = "At least one seat is required.")
    private List<SeatDto> reservedSeats;
}