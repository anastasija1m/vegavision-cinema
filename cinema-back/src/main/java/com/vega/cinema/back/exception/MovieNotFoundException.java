package com.vega.cinema.back.exception;

public class MovieNotFoundException extends RuntimeException {

    public MovieNotFoundException(final Long id) { super(String.format("Movie with id %d not found.", id)); }
}