package com.vega.cinema.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "screening_id", nullable = false)
    private Long screeningId;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "is_cancelled", nullable = false)
    private Boolean isCancelled;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReservedSeat> reservedSeats;
}