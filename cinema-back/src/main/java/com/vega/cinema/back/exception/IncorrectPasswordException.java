package com.vega.cinema.back.exception;

public class IncorrectPasswordException extends RuntimeException {

    public IncorrectPasswordException(final String message) {
        super(message);
    }
}