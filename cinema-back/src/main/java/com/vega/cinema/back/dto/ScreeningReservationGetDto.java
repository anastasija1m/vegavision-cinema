package com.vega.cinema.back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class ScreeningReservationGetDto {

    private Long movieId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime screeningDateTime;
    private Double ticketPrice;
    private MovieGetDto movieGetDto;
    private Integer rows;
    private Integer columns;
}