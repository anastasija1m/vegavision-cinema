package com.vega.cinema.back.exception;

public class ReservationAlreadyCancelledException extends RuntimeException {

    public ReservationAlreadyCancelledException(final String message) { super(message); }
}
