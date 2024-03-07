package com.vega.cinema.back.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PasswordChangeDto {
    private String currentPassword;
    private String newPassword;
}