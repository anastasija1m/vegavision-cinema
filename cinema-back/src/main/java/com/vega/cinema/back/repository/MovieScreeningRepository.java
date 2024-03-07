package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.MovieScreening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MovieScreeningRepository extends JpaRepository<MovieScreening, Long> {

    List<MovieScreening> findByScreeningDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

}