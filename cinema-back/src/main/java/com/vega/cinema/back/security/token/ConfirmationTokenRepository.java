package com.vega.cinema.back.security.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("confirmationTokenRepository")
public interface ConfirmationTokenRepository extends JpaRepository<RegistrationConfirmationToken, String> {
        RegistrationConfirmationToken findByToken(String token);
}