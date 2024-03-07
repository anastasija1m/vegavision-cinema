package com.vega.cinema.back.exception;

public class UsernameExistsException extends RuntimeException{

    public UsernameExistsException(final String username) { super(String.format("User with username: %s already exists.", username)); }
}
