package com.vega.cinema.back.exception;

public class AccountNotConfirmedException extends RuntimeException {

    public AccountNotConfirmedException(final String message) {
        super(message);
    }
}