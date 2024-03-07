package com.vega.cinema.back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserGetDto {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Date dateOfBirth;
    private boolean blocked;
    private String username;
    private boolean isPasswordValid;
}