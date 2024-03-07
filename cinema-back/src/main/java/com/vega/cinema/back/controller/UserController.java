package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.PasswordChangeDto;
import com.vega.cinema.back.dto.PasswordResetDto;
import com.vega.cinema.back.dto.UserGetDto;
import com.vega.cinema.back.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<UserGetDto>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<UserGetDto> result = userService.findAllPaged(pageRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("(hasAnyRole('REGISTERED_USER', 'ROLE_ADMIN') and #id == authentication.principal.id)")
    public ResponseEntity<UserGetDto> findById(@PathVariable Long id) {
        UserGetDto registeredUser = userService.findById(id);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordResetDto passwordResetDto) {
        PasswordResetDto passwordChange = userService.changePassword(passwordResetDto);
        return ResponseEntity.status(HttpStatus.OK).body(passwordChange);
    }

    @PostMapping("/{userId}/block")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> blockUser(@PathVariable Long userId) {
        userService.blockUser(userId);
        return ResponseEntity.ok("User blocked successfully.");
    }

    @GetMapping("/reset-password-user")
    public ResponseEntity<?> resetPassword(@RequestParam("email") String email) {
        userService.resetPasswordByUser(email);
        return ResponseEntity.ok("A password reset link has been sent to your email address.");
    }

    @GetMapping("{id}/reset-password-admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        userService.resetPasswordByAdmin(id);
        return ResponseEntity.ok("A password reset link has been sent to provided email address.");
    }

    @PutMapping("{id}/change-password-via-profile")
    @PreAuthorize("(hasAnyRole('ROLE_REGISTERED_USER', 'ROLE_ADMIN') and #id == authentication.principal.id)")
    public ResponseEntity<UserGetDto> changePasswordViaProfile(@PathVariable Long id, @RequestBody PasswordChangeDto passwordChangeDto) {
        UserGetDto result = userService.changePasswordViaProfile(id, passwordChangeDto);
        return ResponseEntity.ok(result);
    }
}