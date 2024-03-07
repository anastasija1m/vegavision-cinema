package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.GenreCreateDto;
import com.vega.cinema.back.dto.GenreGetDto;
import com.vega.cinema.back.dto.GenreUpdateDto;
import com.vega.cinema.back.exception.GenreExistsException;
import com.vega.cinema.back.model.Genre;
import com.vega.cinema.back.repository.GenreRepository;
import com.vega.cinema.back.service.GenreService;
import com.vega.cinema.back.util.Mapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final Mapper mapper;

    @Override
    public GenreCreateDto create(GenreCreateDto genreCreateDto) throws GenreExistsException {
        if (genreExists(genreCreateDto.getName()).isPresent())
            throw new GenreExistsException(genreCreateDto.getName());

        Genre genre = createGenre(genreCreateDto);
        genreRepository.save(genre);

        return mapper.map(genre, GenreCreateDto.class);
    }

    @Override
    public GenreUpdateDto update(Long id, GenreUpdateDto genreUpdateDto) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Genre with id %d not found.", id)));

        updateGenre(genre, genreUpdateDto);
        genreRepository.save(genre);

        return mapper.map(genre, GenreUpdateDto.class);
    }

    @Override
    public List<GenreGetDto> findAll() {
        return mapper.mapList(genreRepository.findAll(), GenreGetDto.class);
    }

    @Override
    public void delete(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Genre with id %d not found.", id)));

        genreRepository.delete(genre);
    }

    @Override
    public Optional<Genre> genreExists(String genre) {
        return genreRepository.findByName(genre);
    }

    private Genre createGenre(GenreCreateDto genreCreateDto) {
        Genre genre = new Genre();
        genre.setName(genreCreateDto.getName());

        return genre;
    }

    private void updateGenre(Genre genre, GenreUpdateDto genreUpdateDto) {
        genre.setName(genreUpdateDto.getName());
    }
}