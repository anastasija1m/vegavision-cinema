package com.vega.cinema.back.exception;

public class GenreExistsException extends RuntimeException {

    public GenreExistsException(final String name) { super(String.format("Genre with name: %s already exists.", name)); }
}