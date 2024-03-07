package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.*;
import com.vega.cinema.back.service.MovieService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@AllArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieGetDto>> getAll() {
        List<MovieGetDto> movies = movieService.findAll();
        return ResponseEntity.ok(movies);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> create(@RequestBody MovieCreateDto movieCreateDto) {
        MovieCreateDto createdMovie = movieService.create(movieCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MovieUpdateDto> update(@PathVariable Long id, @RequestBody MovieUpdateDto movieUpdateDto) {
        MovieUpdateDto updatedMovie = movieService.update(id, movieUpdateDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/fetch-by-ids")
    public ResponseEntity<List<MovieGetDto>> fetchMoviesByIds(@RequestBody List<Long> movieIds) {
        List<MovieGetDto> movies = movieService.findByIds(movieIds);
        return ResponseEntity.ok(movies);
    }
}