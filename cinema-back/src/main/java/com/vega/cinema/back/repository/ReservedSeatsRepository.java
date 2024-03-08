package com.vega.cinema.back.repository;

import com.vega.cinema.back.dto.SeatDto;
import com.vega.cinema.back.model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservedSeatsRepository extends JpaRepository<ReservedSeat, Long> {

    @Query("SELECT rs FROM Reservation r JOIN r.reservedSeats rs " +
            "WHERE r.screeningId = :screeningId " +
            "AND (rs.seatRow, rs.seatColumn) IN (:seatList)")
    List<SeatDto> findAlreadyReservedSeats(@Param("screeningId") Long screeningId, @Param("seatList") List<SeatDto> seatList);
}