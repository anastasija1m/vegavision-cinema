package com.vega.cinema.back.service;

import com.vega.cinema.back.security.authentication.AuthenticationRequest;
import com.vega.cinema.back.security.authentication.AuthenticationResponse;

public interface AuthenticationService {

    AuthenticationResponse authenticate(AuthenticationRequest request);
}
