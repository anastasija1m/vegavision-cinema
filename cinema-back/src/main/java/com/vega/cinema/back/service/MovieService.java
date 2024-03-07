package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.MovieCreateDto;
import com.vega.cinema.back.dto.MovieGetDto;
import com.vega.cinema.back.dto.MovieUpdateDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MovieService {

    List<MovieGetDto> findAll();
    MovieCreateDto create(MovieCreateDto movieCreateDto);
    MovieUpdateDto update(Long id, MovieUpdateDto movieUpdateDto);
    void delete(Long movieId);
    List<MovieGetDto> findByIds(List<Long> movieIds);
}