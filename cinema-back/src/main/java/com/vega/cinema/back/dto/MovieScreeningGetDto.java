package com.vega.cinema.back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class MovieScreeningGetDto {

    private Long id;
    private Long movieId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime screeningDateTime;
    private double ticketPrice;
    private int rows;
    private int columns;
    private List<Long> movieIds;
}