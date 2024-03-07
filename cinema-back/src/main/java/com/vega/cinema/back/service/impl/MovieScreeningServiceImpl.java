package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.MovieScreeningCreateDto;
import com.vega.cinema.back.dto.MovieScreeningGetDto;
import com.vega.cinema.back.dto.MovieScreeningFilteredDto;
import com.vega.cinema.back.dto.MovieScreeningUpdateDto;
import com.vega.cinema.back.model.Movie;
import com.vega.cinema.back.model.MovieScreening;
import com.vega.cinema.back.model.ReservedSeat;
import com.vega.cinema.back.repository.MovieRepository;
import com.vega.cinema.back.repository.MovieScreeningRepository;
import com.vega.cinema.back.service.MovieScreeningService;
import com.vega.cinema.back.util.Mapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class MovieScreeningServiceImpl implements MovieScreeningService {

    private final MovieRepository movieRepository;
    private final MovieScreeningRepository movieScreeningRepository;
    private final Mapper mapper;

    @Override
    public List<MovieScreeningGetDto> findAll() {
        return mapper.mapList(movieScreeningRepository.findAll(), MovieScreeningGetDto.class);
    }

    @Override
    public void delete(Long id) {
        MovieScreening movieScreening = movieScreeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie Screening not found"));

        movieScreeningRepository.delete(movieScreening);
    }

    @Override
    public MovieScreeningUpdateDto update(Long id, MovieScreeningUpdateDto movieScreeningUpdateDto) {
        MovieScreening movieScreening = movieScreeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie screening not found"));

        updateMovieScreening(movieScreening, movieScreeningUpdateDto);
        movieScreeningRepository.save(movieScreening);

        return mapper.map(movieScreening, MovieScreeningUpdateDto.class);
    }

    private void updateMovieScreening(MovieScreening movieScreening, MovieScreeningUpdateDto movieScreeningUpdateDto) {
        movieScreening.setTicketPrice(movieScreeningUpdateDto.getTicketPrice());
        movieScreening.setScreeningDate(movieScreeningUpdateDto.getScreeningDateTime());
        movieScreening.setRows(movieScreeningUpdateDto.getRows());
        movieScreening.setColumns(movieScreeningUpdateDto.getColumns());
    }

    @Override
    public MovieScreeningCreateDto create(MovieScreeningCreateDto movieScreeningCreateDto) {
        MovieScreening movieScreening = createMovieScreening(movieScreeningCreateDto);
        movieScreeningRepository.save(movieScreening);

        return mapper.map(movieScreening, MovieScreeningCreateDto.class);
    }

    private MovieScreening createMovieScreening(MovieScreeningCreateDto movieScreeningCreateDto) {
        Movie movie = movieRepository.findById(movieScreeningCreateDto.getMovieId())
                .orElseThrow(() -> new EntityNotFoundException("Movie not found"));

        MovieScreening movieScreening = new MovieScreening();
        movieScreening.setMovie(movie);
        movieScreening.setColumns(movieScreeningCreateDto.getColumns());
        movieScreening.setRows(movieScreeningCreateDto.getRows());
        movieScreening.setScreeningDate(movieScreeningCreateDto.getScreeningDateTime());
        movieScreening.setTicketPrice(movieScreeningCreateDto.getTicketPrice());

        return movieScreening;
    }

    @Override
    public Page<MovieScreeningGetDto> findAllPaged(Pageable pageable) {
        Page<MovieScreening> movieScreenings = movieScreeningRepository.findAll(pageable);
        return mapper.mapPage(movieScreenings, MovieScreeningGetDto.class);
    }

    @Override
    public MovieScreeningFilteredDto findAllFiltered(LocalDate date, List<Long> genreIds) {
        validateDate(date);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.of(23, 59, 59));

        List<MovieScreening> movieScreenings = findMovieScreenings(startOfDay, endOfDay, genreIds);
        Set<Long> uniqueMovieIds = extractUniqueMovieIds(movieScreenings);
        List<MovieScreeningGetDto> movieScreeningGetDtos = mapper.mapList(movieScreenings, MovieScreeningGetDto.class);

        return createResponseDto(uniqueMovieIds, movieScreeningGetDtos);
    }

    @Override
    public MovieScreeningGetDto findById(Long id) {
        MovieScreening movieScreening = movieScreeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Movie screening with id %s not found", id)));

        return mapper.map(movieScreening, MovieScreeningGetDto.class);
    }

    private void validateDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        if (date.isBefore(today) || date.isAfter(nextWeek)) {
            throw new IllegalArgumentException("Date must be within today and the next 7 days.");
        }
    }

    private List<MovieScreening> findMovieScreenings(LocalDateTime startOfDay, LocalDateTime endOfDay, List<Long> genreIds) {
        List<MovieScreening> movieScreenings = movieScreeningRepository.findByScreeningDateBetween(startOfDay, endOfDay);

        if (genreIds != null) {
            movieScreenings = filterByGenre(movieScreenings, genreIds);
        }

        return movieScreenings;
    }

    private List<MovieScreening> filterByGenre(List<MovieScreening> movieScreenings, List<Long> genreIds) {
        return movieScreenings.stream()
                .filter(screening -> screening.getMovie().getGenres().stream()
                        .anyMatch(genre -> genreIds.contains(genre.getId())))
                .collect(Collectors.toList());
    }

    private Set<Long> extractUniqueMovieIds(List<MovieScreening> movieScreenings) {
        return movieScreenings.stream()
                .map(screening -> screening.getMovie().getId())
                .collect(Collectors.toSet());
    }

    private MovieScreeningFilteredDto createResponseDto(Set<Long> uniqueMovieIds, List<MovieScreeningGetDto> movieScreeningGetDtos) {
        MovieScreeningFilteredDto responseDto = new MovieScreeningFilteredDto();
        responseDto.setMovieIds(new ArrayList<>(uniqueMovieIds));
        responseDto.setMovieScreenings(movieScreeningGetDtos);
        return responseDto;
    }
}