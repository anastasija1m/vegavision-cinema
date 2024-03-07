package com.vega.cinema.back.service.impl;

import com.vega.cinema.back.dto.*;
import com.vega.cinema.back.exception.*;
import com.vega.cinema.back.exception.handlers.*;
import com.vega.cinema.back.model.*;
import com.vega.cinema.back.repository.*;
import com.vega.cinema.back.security.token.*;
import com.vega.cinema.back.service.*;
import com.vega.cinema.back.util.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final RegisteredUserRepository registeredUserRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailSender emailSender;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public UserRegistrationDto register(UserRegistrationDto userRegistrationDto) throws EmailExistsException, UsernameExistsException {
        if (emailExists(userRegistrationDto.getEmail()).isPresent())
            throw new EmailExistsException(userRegistrationDto.getEmail());

        if (usernameExists(userRegistrationDto.getUsername()).isPresent())
            throw new UsernameExistsException(userRegistrationDto.getUsername());

        RegisteredUser user = createUser(userRegistrationDto);
        userRepository.save(user);

        sendRegistrationEmail(user);

        return mapper.map(user, UserRegistrationDto.class);
    }

    private RegisteredUser createUser(UserRegistrationDto userRegistrationDto) {
        RegisteredUser user = new RegisteredUser();

        user.setName(userRegistrationDto.getName());
        user.setSurname(userRegistrationDto.getSurname());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setEmail(userRegistrationDto.getEmail());
        user.setDateOfBirth(userRegistrationDto.getDateOfBirth());
        user.setUsername(userRegistrationDto.getUsername());
        user.setBlocked(false);
        user.setEnabled(false);
        user.setPasswordValid(true);

        return user;
    }

    @Override
    public Optional<User> emailExists(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> usernameExists(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserRegistrationDto confirmRegistration(String token) {
        RegistrationConfirmationToken registrationConfirmationToken = confirmationTokenRepository.findByToken(token);
        User user = registrationConfirmationToken.getUser();

        if (registrationConfirmationToken.getExpiryDate().before(new Date())) {
            throw new InvalidTokenException("Token has expired");
        }

        user.setEnabled(true);
        userRepository.save(user);

        confirmationTokenRepository.delete(registrationConfirmationToken);

        return mapper.map(user, UserRegistrationDto.class);
    }

    @Override
    public PasswordResetDto changePassword(PasswordResetDto passwordResetDto) {
        String token = passwordResetDto.getToken();
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired token"));

        if (passwordResetToken.getExpiryDate().before(new Date())) {
            throw new InvalidTokenException("Token has expired");
        }

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(passwordResetDto.getPassword()));

        if(user instanceof RegisteredUser registeredUser)
            registeredUser.setPasswordValid(true);

        userRepository.save(user);
        passwordResetTokenRepository.delete(passwordResetToken);

        return passwordResetDto;
    }

    @Override
    public void resetPasswordByAdmin(Long userId) {
        RegisteredUser user = registeredUserRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setPasswordValid(false);
        userRepository.save(user);

        PasswordResetToken passwordResetToken = new PasswordResetToken(user);
        passwordResetTokenRepository.save(passwordResetToken);

        String resetPasswordLink = "http://localhost:3000/change-password/" + passwordResetToken.getToken();

        String emailSubject = "Reset Your Password";
        String emailBody = "To reset your password, click the link below:\n" + resetPasswordLink;
        sendEmail(user, emailSubject, emailBody);
    }

    @Override
    public void resetPasswordByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        PasswordResetToken passwordResetToken = new PasswordResetToken(user);
        passwordResetTokenRepository.save(passwordResetToken);

        String resetPasswordLink = "http://localhost:3000/change-password/" + passwordResetToken.getToken();

        String emailSubject = "Reset Your Password";
        String emailBody = "To reset your password, click the link below:\n" + resetPasswordLink;
        sendEmail(user, emailSubject, emailBody);
    }

    @Override
    public Page<UserGetDto> findAllPaged(Pageable pageable){
        Page<RegisteredUser> users = registeredUserRepository.findAll(pageable);
        return mapper.mapPage(users, UserGetDto.class);
    }

    @Override
    public void blockUser(Long userId) {
        RegisteredUser user = registeredUserRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setBlocked(true);
        userRepository.save(user);
    }

    @Override
    public UserGetDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if(user instanceof RegisteredUser registeredUser)
            return mapper.map(registeredUser, UserGetDto.class);

        return mapper.map(user, UserGetDto.class);
    }

    @Override
    public UserGetDto changePasswordViaProfile(Long id, PasswordChangeDto passwordChangeDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        validateCurrentPassword(passwordChangeDto.getCurrentPassword(), user);
        user.setPassword(encodePassword(passwordChangeDto.getNewPassword(), passwordChangeDto.getCurrentPassword()));

        if(user instanceof RegisteredUser registeredUser)
            registeredUser.setPasswordValid(true);

        userRepository.save(user);

        return mapper.map(user, UserGetDto.class);
    }

    private void validateCurrentPassword(String currentPassword, User existingUser) throws IncorrectPasswordException {
        if (!passwordEncoder.matches(currentPassword, existingUser.getPassword()))
            throw new IncorrectPasswordException("Current password is incorrect");
    }

    private String encodePassword(String newPassword, String currentPassword) {
        boolean hasNewPassword = newPassword != null && !newPassword.isBlank();
        return hasNewPassword ? passwordEncoder.encode(newPassword) : passwordEncoder.encode(currentPassword);
    }

    private void sendRegistrationEmail(User user) {
        RegistrationConfirmationToken token = new RegistrationConfirmationToken(user);
        confirmationTokenRepository.save(token);

        String confirmationLink = "http://localhost:8080/api/user-management/confirm-account?token=" + token.getToken();
        String registrationSubject = "Complete your registration!";
        String registrationMessage = "To be able to log into your account, please click on the following link: " + confirmationLink;

        sendEmail(user, registrationSubject, registrationMessage);
    }

    private void sendEmail(User user, String subject, String message) {
        try {
            emailSender.sendEmail(user, subject, message);
        } catch (MailException e) {
            throw new EmailNotSentException("Failed to send registration email to user: " + user.getEmail());
        }
    }
}