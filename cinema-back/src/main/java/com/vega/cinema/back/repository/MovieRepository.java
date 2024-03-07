package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByIdIn(List<Long> movieIds);
}
