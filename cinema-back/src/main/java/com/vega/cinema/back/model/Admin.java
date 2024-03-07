package com.vega.cinema.back.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admins")
public class Admin extends User {

    @Override
    public Role getRole() {
        return Role.ADMIN;
    }
}
