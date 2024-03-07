package com.vega.cinema.back.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(final String email) { super(String.format("User with email: %s not found. ", email)); }

    public UserNotFoundException(final Long id) { super(String.format("User with id: %d not found.", id)); }
}