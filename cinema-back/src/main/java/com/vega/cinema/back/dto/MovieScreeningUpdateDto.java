package com.vega.cinema.back.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class MovieScreeningUpdateDto {

    private Long id;

    @NotNull(message = "Ticket price is required")
    private Double ticketPrice;

    @NotNull(message = "Screening date is required")
    private LocalDateTime screeningDateTime;

    @NotNull(message = "Number of rows is required")
    @Min(value = 1, message = "Number of rows must be at least 1")
    private Integer rows;

    @NotNull(message = "Number of columns is required")
    @Min(value = 1, message = "Number of columns must be at least 1")
    private Integer columns;

    @NotNull(message = "Movie is required")
    private Integer movieId;
}
