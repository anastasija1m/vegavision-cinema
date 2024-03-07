package com.vega.cinema.back.security.token;

import com.vega.cinema.back.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="tokens")
public class Token {

    private static final int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="token_id")
    private long id;

    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    private Date expiryDate;

    public Token(User user) {
        this.user = user;
        this.expiryDate = calculateExpiryDate();
        this.token = UUID.randomUUID().toString();
    }

    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, Token.EXPIRATION);
        return cal.getTime();
    }
}