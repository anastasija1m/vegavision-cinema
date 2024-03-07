package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservedSeatRepository extends JpaRepository<ReservedSeat, Long> {

}