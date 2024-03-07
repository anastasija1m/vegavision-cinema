package com.vega.cinema.back.exception;

public class MovieListEmptyException extends RuntimeException {

    public MovieListEmptyException() { super("Provided movie list of IDs is empty."); }
}
