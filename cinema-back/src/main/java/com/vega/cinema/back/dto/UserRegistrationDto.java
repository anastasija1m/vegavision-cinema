package com.vega.cinema.back.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {

    @NotEmpty(message = "Name is required")
    @Size(min = 2, max = 32)
    private String name;

    @NotEmpty(message = "Surname is required")
    @Size(min = 2, max = 32)
    private String surname;

    @NotEmpty(message = "Email is required")
    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;

    @NotEmpty(message = "Username is required")
    private String username;

    @NotEmpty(message = "Date of birth is required")
    private Date dateOfBirth;
}