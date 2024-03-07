package com.vega.cinema.back.exception;

public class TokenExpiredException extends RuntimeException {

    public TokenExpiredException() { super("Token has expired."); }
}
