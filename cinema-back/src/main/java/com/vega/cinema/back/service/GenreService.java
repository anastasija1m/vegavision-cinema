package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.GenreCreateDto;
import com.vega.cinema.back.dto.GenreGetDto;
import com.vega.cinema.back.dto.GenreUpdateDto;
import com.vega.cinema.back.exception.GenreExistsException;
import com.vega.cinema.back.model.Genre;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface GenreService {

    List<GenreGetDto> findAll();
    GenreCreateDto create(GenreCreateDto genreDto) throws GenreExistsException;
    GenreUpdateDto update(Long id, GenreUpdateDto genreDto);
    void delete(Long genreId);
    Optional<Genre> genreExists(String name);
}