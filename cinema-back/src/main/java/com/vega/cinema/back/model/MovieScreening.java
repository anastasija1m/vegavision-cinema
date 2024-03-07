package com.vega.cinema.back.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "movie_screenings")
public class MovieScreening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "ticket_price", nullable = false)
    private double ticketPrice;

    @Column(name = "screening_date", nullable = false)
    private LocalDateTime screeningDate;

    @Column(name = "rows", nullable = false)
    @Min(value = 1)
    private int rows;

    @Column(name = "columns", nullable = false)
    @Min(value = 1)
    private int columns;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "movie_id", nullable = false)
    @Immutable
    private Movie movie;
}