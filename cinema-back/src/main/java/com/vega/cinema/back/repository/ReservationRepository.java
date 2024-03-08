package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT CASE WHEN COUNT(r) > 0 " +
            "THEN TRUE ELSE FALSE END FROM Reservation r " +
            "JOIN r.reservedSeats rs " +
            "WHERE r.screeningId = :screeningId " +
            "AND rs.seatRow = :seatRow " +
            "AND rs.seatColumn = :seatColumn")
    boolean existsByReservedSeat(@Param("screeningId") Long screeningId, @Param("seatRow") Integer seatRow, @Param("seatColumn") Integer seatColumn);

    @Query("SELECT r, s, m FROM Reservation r " +
            "JOIN FETCH MovieScreening s ON r.screeningId = s.id " +
            "JOIN FETCH Movie m ON s.movie.id = m.id " +
            "WHERE r.userEmail = :email " +
            "AND (:type = 'future' AND s.screeningDate > :now OR :type = 'passed' AND s.screeningDate < :now)")
    Page<Object[]> findAllForUserPagedWithMovieAndScreening(@Param("email") String email, @Param("now") LocalDateTime now, @Param("type") String type, Pageable pageable);

    List<Reservation> findReservationsByScreeningId(Long screeningId);
}