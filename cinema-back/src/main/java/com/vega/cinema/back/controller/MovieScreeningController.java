package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.MovieScreeningCreateDto;
import com.vega.cinema.back.dto.MovieScreeningGetDto;
import com.vega.cinema.back.dto.MovieScreeningFilteredDto;
import com.vega.cinema.back.dto.MovieScreeningUpdateDto;
import com.vega.cinema.back.model.MovieScreening;
import com.vega.cinema.back.service.MovieScreeningService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("api/movie-screenings")
@AllArgsConstructor
public class MovieScreeningController {

    private final MovieScreeningService movieScreeningService;

    @GetMapping
    public ResponseEntity<Page<MovieScreeningGetDto>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<MovieScreeningGetDto> result = movieScreeningService.findAllPaged(pageRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> create(@RequestBody MovieScreeningCreateDto movieScreeningCreateDto) {
        MovieScreeningCreateDto createdMovieScreening = movieScreeningService.create(movieScreeningCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovieScreening);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        movieScreeningService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MovieScreeningUpdateDto> update(@PathVariable Long id, @RequestBody MovieScreeningUpdateDto movieScreeningUpdateDto) {
        MovieScreeningUpdateDto updatedMovieScreening = movieScreeningService.update(id, movieScreeningUpdateDto);
        return ResponseEntity.ok(updatedMovieScreening);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<MovieScreeningGetDto>> getAll() {
        List<MovieScreeningGetDto> movieScreenings = movieScreeningService.findAll();
        return ResponseEntity.ok(movieScreenings);
    }

    @GetMapping("/get-all-filtered")
    public ResponseEntity<MovieScreeningFilteredDto> findAllFiltered2(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) List<Long> genreIds) {
        LocalDate filterDate = (date != null) ? date : LocalDate.now(ZoneId.of("UTC"));
        MovieScreeningFilteredDto movieScreenings = movieScreeningService.findAllFiltered(filterDate, genreIds);
        return ResponseEntity.ok(movieScreenings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieScreeningGetDto> findById(@PathVariable Long id) {
        MovieScreeningGetDto movieScreening = movieScreeningService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(movieScreening);
    }
}