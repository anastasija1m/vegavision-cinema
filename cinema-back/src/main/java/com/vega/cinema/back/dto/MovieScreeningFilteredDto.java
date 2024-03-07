package com.vega.cinema.back.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class MovieScreeningFilteredDto {

    private List<Long> movieIds;
    private List<MovieScreeningGetDto> movieScreenings;
}
