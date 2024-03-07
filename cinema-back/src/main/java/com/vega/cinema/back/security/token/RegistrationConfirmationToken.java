package com.vega.cinema.back.security.token;

import com.vega.cinema.back.model.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "confirmation_tokens")
public class RegistrationConfirmationToken extends Token {

    public RegistrationConfirmationToken(User user) {
        super(user);
    }
}