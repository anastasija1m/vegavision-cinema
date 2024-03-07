package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.MovieScreeningCreateDto;
import com.vega.cinema.back.dto.MovieScreeningGetDto;
import com.vega.cinema.back.dto.MovieScreeningFilteredDto;
import com.vega.cinema.back.dto.MovieScreeningUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface MovieScreeningService {

    List<MovieScreeningGetDto> findAll();
    void delete(Long id);
    MovieScreeningUpdateDto update(Long id, MovieScreeningUpdateDto movieScreeningUpdateDto);
    MovieScreeningCreateDto create(MovieScreeningCreateDto movieScreeningCreateDto);
    Page<MovieScreeningGetDto> findAllPaged(Pageable pageable);
    MovieScreeningFilteredDto findAllFiltered(LocalDate filterDate, List<Long> genreIds);
    MovieScreeningGetDto findById(Long id);
}