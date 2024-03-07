package com.vega.cinema.back.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SeatDto {

    private Integer seatRow;
    private Integer seatColumn;
}