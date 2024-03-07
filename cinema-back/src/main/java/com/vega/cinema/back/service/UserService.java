package com.vega.cinema.back.service;

import com.vega.cinema.back.dto.PasswordChangeDto;
import com.vega.cinema.back.dto.PasswordResetDto;
import com.vega.cinema.back.dto.UserGetDto;
import com.vega.cinema.back.dto.UserRegistrationDto;
import com.vega.cinema.back.exception.EmailExistsException;
import com.vega.cinema.back.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {
    UserRegistrationDto register(UserRegistrationDto userRegistrationDto) throws EmailExistsException;
    Optional<User> emailExists(String email);
    Optional<User> usernameExists(String username);
    UserRegistrationDto confirmRegistration(String token);
    void resetPasswordByUser(String email);
    void resetPasswordByAdmin(Long userId);
    PasswordResetDto changePassword(PasswordResetDto passwordResetDto);
    Page<UserGetDto> findAllPaged(Pageable pageable);
    void blockUser(Long userId);
    UserGetDto findById(Long id);
    public UserGetDto changePasswordViaProfile(Long id, PasswordChangeDto passwordChangeDto);
}