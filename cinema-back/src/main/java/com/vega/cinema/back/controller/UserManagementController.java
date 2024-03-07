package com.vega.cinema.back.controller;

import com.vega.cinema.back.dto.UserRegistrationDto;
import com.vega.cinema.back.exception.TokenExpiredException;
import com.vega.cinema.back.security.authentication.AuthenticationRequest;
import com.vega.cinema.back.security.authentication.AuthenticationResponse;
import com.vega.cinema.back.service.AuthenticationService;
import com.vega.cinema.back.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("api/user-management")
@AllArgsConstructor
public class UserManagementController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        UserRegistrationDto registeredUser = userService.register(userRegistrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/confirm-account")
    public ResponseEntity<String> confirmAccount(@RequestParam("token") String token) {
        try {
            UserRegistrationDto confirmedUser = userService.confirmRegistration(token);
            if (confirmedUser != null) {
                return loadHtmlFile("confirmation.html");
            } else {
                return loadHtmlFile("error.html");
            }
        } catch (TokenExpiredException e) {
            return loadHtmlFile("error.html");
        }
    }

    private ResponseEntity<String> loadHtmlFile(String filename) {
        Resource resource = new ClassPathResource("/static/" + filename);
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] data = inputStream.readAllBytes();
            String htmlContent = new String(data);
            return ResponseEntity.ok(htmlContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading HTML page: " + filename);
        }
    }
}
