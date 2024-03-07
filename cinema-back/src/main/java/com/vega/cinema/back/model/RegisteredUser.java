package com.vega.cinema.back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "registered_users")
public class RegisteredUser extends User {

    @Column(name = "blocked", nullable = false)
    private boolean blocked;

    @Column(name = "isPasswordValid", nullable = false)
    private boolean isPasswordValid;

    @Override
    public Role getRole() {
        return Role.REGISTERED_USER;
    }
}