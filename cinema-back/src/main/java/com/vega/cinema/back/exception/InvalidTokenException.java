package com.vega.cinema.back.exception;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(final String message) {
        super(message);
    }
}