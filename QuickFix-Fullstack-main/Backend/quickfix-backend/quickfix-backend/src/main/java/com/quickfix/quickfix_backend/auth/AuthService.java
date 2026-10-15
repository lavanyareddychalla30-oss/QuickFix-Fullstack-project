
package com.quickfix.quickfix_backend.auth;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quickfix.quickfix_backend.entity.AppUser;
import com.quickfix.quickfix_backend.repository.AppUserRepository;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    @Transactional
    public AppUser register(
            String fullName,
            String email,
            String password) {

        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (email == null || email.isBlank()
                || !email.trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Enter a valid email");
        }

        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters");
        }

        String normalizedEmail = normalizeEmail(email);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "Email already registered");
        }

        AppUser user = new AppUser();

        user.setFullName(fullName.trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setActive(true);

        return userRepository.saveAndFlush(user);
    }

    public boolean login(String email, String password) {
        if (email == null || email.isBlank() || password == null) {
            return false;
        }

        return userRepository.findByEmail(normalizeEmail(email))
                .map(user -> user.isActive()
                        && passwordEncoder.matches(
                                password, user.getPassword()))
                .orElse(false);
    }

    public AppUser findByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }
}
