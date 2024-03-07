package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.GenreCreateDto;
import com.vega.cinema.back.dto.GenreGetDto;
import com.vega.cinema.back.dto.GenreUpdateDto;
import com.vega.cinema.back.service.GenreService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@AllArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping()
    public ResponseEntity<List<GenreGetDto>> getAll() {
        List<GenreGetDto> genres = genreService.findAll();
        return ResponseEntity.ok(genres);
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> create(@RequestBody GenreCreateDto genreCreateDto) {
        GenreCreateDto createdGenre = genreService.create(genreCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGenre);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GenreUpdateDto> update(@PathVariable Long id, @RequestBody GenreUpdateDto genreUpdateDto) {
        GenreUpdateDto updatedGenre = genreService.update(id, genreUpdateDto);
        return ResponseEntity.ok(updatedGenre);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        genreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}