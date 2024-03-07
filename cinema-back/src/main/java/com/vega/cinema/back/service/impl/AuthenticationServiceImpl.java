package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.model.RegisteredUser;
import com.vega.cinema.back.model.User;
import com.vega.cinema.back.repository.UserRepository;
import com.vega.cinema.back.security.authentication.AuthenticationRequest;
import com.vega.cinema.back.security.authentication.AuthenticationResponse;
import com.vega.cinema.back.security.authentication.JwtService;
import com.vega.cinema.back.security.token.JwtToken;
import com.vega.cinema.back.security.token.TokenRepository;
import com.vega.cinema.back.security.token.TokenType;
import com.vega.cinema.back.service.AuthenticationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        if(user instanceof RegisteredUser registeredUser) {
            if (registeredUser.isBlocked()) {
                throw new IllegalArgumentException("Your account is blocked. Please contact support.");
            }

            if(!registeredUser.isPasswordValid()) {
                throw new IllegalArgumentException("Your password was invalidated. Check your email for password change.");
            }
        }

        var jwtToken = jwtService.generateToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .id(user.getId())
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = JwtToken.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(Math.toIntExact(user.getId()));
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
}