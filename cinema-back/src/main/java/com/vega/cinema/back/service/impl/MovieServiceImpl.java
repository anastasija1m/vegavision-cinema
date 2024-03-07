package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.MovieCreateDto;
import com.vega.cinema.back.dto.MovieGetDto;
import com.vega.cinema.back.dto.MovieUpdateDto;
import com.vega.cinema.back.exception.MovieListEmptyException;
import com.vega.cinema.back.exception.MovieNotFoundException;
import com.vega.cinema.back.model.Genre;
import com.vega.cinema.back.model.Movie;
import com.vega.cinema.back.repository.GenreRepository;
import com.vega.cinema.back.repository.MovieRepository;
import com.vega.cinema.back.service.MovieService;
import com.vega.cinema.back.util.Mapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final Mapper mapper;
    private final GenreRepository genreRepository;

    @Override
    public List<MovieGetDto> findAll() {
        return mapper.mapList(movieRepository.findAll(), MovieGetDto.class);
    }

    @Override
    public MovieCreateDto create(MovieCreateDto movieCreateDto) {
        Movie movie = createMovie(movieCreateDto);
        movieRepository.save(movie);

        return mapper.map(movie, MovieCreateDto.class);
    }

    private Movie createMovie(MovieCreateDto movieCreateDto) {
        Movie movie = new Movie();
        movie.setName(movieCreateDto.getName());
        movie.setOriginalName(movieCreateDto.getOriginalName());
        movie.setPosterUrl(movieCreateDto.getPosterUrl());
        movie.setDuration(movieCreateDto.getDuration());
        Set<Genre> genres = findGenresByIds(movieCreateDto.getGenreIds());
        movie.setGenres(new ArrayList<>(genres));
        genres.forEach(genre -> genre.getMovies().add(movie));
        return movie;
    }

    @Override
    public MovieUpdateDto update(Long id, MovieUpdateDto movieUpdateDto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));

        updateMovie(movie, movieUpdateDto);
        movieRepository.save(movie);

        return mapper.map(movie, MovieUpdateDto.class);
    }

    private void updateMovie(Movie movie, MovieUpdateDto movieUpdateDto) {
        movie.setName(movieUpdateDto.getName());
        movie.setOriginalName(movieUpdateDto.getOriginalName());
        movie.setPosterUrl(movieUpdateDto.getPosterUrl());
        movie.setDuration(movieUpdateDto.getDuration());

        Set<Genre> genres = findGenresByIds(movieUpdateDto.getGenreIds());
        movie.setGenres(new ArrayList<>(genres));
        genres.forEach(genre -> genre.getMovies().add(movie));
    }

    @Override
    public void delete(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(movieId));
        removeMovieFromGenres(movie);
        movieRepository.delete(movie);
    }

    @Override
    public List<MovieGetDto> findByIds(List<Long> movieIds) {
        List<Movie> movies = movieRepository.findByIdIn(movieIds);
        if (movies.isEmpty()) {
            throw new MovieListEmptyException();
        }
        return mapper.mapList(movies, MovieGetDto.class);
    }

    private Set<Genre> findGenresByIds(List<Long> genreIds) {
        return genreIds.stream()
                .map(genreId -> genreRepository.findById(genreId).orElseThrow())
                .collect(Collectors.toSet());
    }

    private void removeMovieFromGenres(Movie movie) {
        movie.getGenres().forEach(genre -> genre.getMovies().remove(movie));
    }
}