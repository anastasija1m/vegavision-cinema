package com.vega.cinema.back.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "poster_url", unique = true, nullable = false)
    private String posterUrl;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "duration", nullable = false)
    @Min(value = 20)
    @Max(value = 200)
    private Integer duration;

    @ManyToMany
    @JoinTable(
            name = "movie_genre",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private List<Genre> genres;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<MovieScreening> screenings;
}