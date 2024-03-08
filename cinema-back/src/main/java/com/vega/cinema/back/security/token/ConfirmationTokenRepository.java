package com.vega.cinema.back.security.token;

import com.vega.cinema.back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("confirmationTokenRepository")
public interface ConfirmationTokenRepository extends JpaRepository<RegistrationConfirmationToken, String> {

        RegistrationConfirmationToken findByToken(String token);
        void deleteByUser(User user);
}