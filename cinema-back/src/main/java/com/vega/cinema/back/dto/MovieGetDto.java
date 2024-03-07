package com.vega.cinema.back.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class MovieGetDto {

    private Long id;
    private String posterUrl;
    private String name;
    private String originalName;
    private Integer duration;
    private List<GenreGetDto> genres;
}