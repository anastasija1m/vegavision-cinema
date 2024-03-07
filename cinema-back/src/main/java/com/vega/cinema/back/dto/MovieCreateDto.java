package com.vega.cinema.back.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class MovieCreateDto {

    @NotEmpty(message = "Poster URL is required")
    private String posterUrl;

    @NotEmpty(message = "Name is required")
    @Size(min = 2, max = 32, message = "Name must be between 2 and 32 characters long")
    private String name;

    @NotEmpty(message = "Original name is required")
    @Size(min = 2, max = 32, message = "Original name must be between 2 and 32 characters long")
    private String originalName;

    @NotEmpty(message = "Movie duration is required")
    @Min(value = 20, message = "Duration should be at least 20 minutes")
    @Max(value = 200, message = "Duration should not exceed 200 minutes")
    private Integer duration;

    private List<Long> genreIds;
}