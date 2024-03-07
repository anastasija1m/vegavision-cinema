package com.vega.cinema.back.exception;

public class SeatAlreadyReservedException extends RuntimeException {

    public SeatAlreadyReservedException(Integer row, Integer column, String movieName) { super(String.format("Seat at row %d, column %d is already reserved for %s screening", row, column, movieName)); }
}