package com.vega.cinema.back.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class GenreGetDto {

    private Long id;
    private String name;
}