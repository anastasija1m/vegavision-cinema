package com.vega.cinema.back.exception;

public class ScreeningAlreadyPassedException extends RuntimeException {

    public ScreeningAlreadyPassedException(final String message) { super(message); }
}