package com.vega.cinema.back.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class GenreUpdateDto {

    private Long id;

    @NotEmpty(message = "Name is required")
    @Size(min = 2, max = 32)
    private String name;
}
