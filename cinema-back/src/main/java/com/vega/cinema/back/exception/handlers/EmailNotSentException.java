package com.vega.cinema.back.exception.handlers;

public class EmailNotSentException extends RuntimeException {

    public EmailNotSentException(final String message) { super(message); }
}