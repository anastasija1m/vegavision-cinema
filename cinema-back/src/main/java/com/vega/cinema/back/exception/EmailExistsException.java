package com.vega.cinema.back.exception;

public class EmailExistsException extends RuntimeException {

    public EmailExistsException(final String email) { super(String.format("User with email: %s already exists.", email)); }
}
