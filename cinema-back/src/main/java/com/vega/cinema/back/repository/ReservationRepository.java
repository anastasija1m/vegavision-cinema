package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.Reservation;
import com.vega.cinema.back.model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT CASE WHEN COUNT(r) > 0 " +
            "THEN TRUE ELSE FALSE END FROM Reservation r " +
            "JOIN r.reservedSeats rs " +
            "WHERE r.screeningId = :screeningId " +
            "AND rs.seatRow = :seatRow " +
            "AND rs.seatColumn = :seatColumn")
    boolean existsByReservedSeat(@Param("screeningId") Long screeningId, @Param("seatRow") Integer seatRow, @Param("seatColumn") Integer seatColumn);

    List<Reservation> findReservationsByScreeningId(Long screeningId);
}