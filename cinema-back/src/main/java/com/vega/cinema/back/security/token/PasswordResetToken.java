package com.vega.cinema.back.security.token;

import com.vega.cinema.back.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="password_reset_tokens")
public class PasswordResetToken extends Token {

    public PasswordResetToken(User user) {
        super(user);
    }
}