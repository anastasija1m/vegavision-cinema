package com.vega.cinema.back.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class MyReservationsGetDto {

    private Long id;
    private String userEmail;
    private Long screeningId;
    private Double totalPrice;
    private Integer discountPercent;
    private String code;
    private List<SeatDto> reservedSeats;
    private boolean isCancelled;
    private ScreeningReservationGetDto movieScreeningGetDto;
}