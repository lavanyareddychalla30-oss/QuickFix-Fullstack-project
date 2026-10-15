
package com.quickfix.quickfix_backend.auth;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quickfix.quickfix_backend.entity.AppUser;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> data) {

        try {
            String fullName = data.get("fullName");
            String email = data.get("email");
            String password = data.get("password");

            AppUser user = authService.register(
                    fullName, email, password);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Registration successful",
                            "user", Map.of(
                                    "id", user.getId(),
                                    "fullName", user.getFullName(),
                                    "email", user.getEmail(),
                                    "role", user.getRole()
                            )
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage()));


} catch (DataIntegrityViolationException e) {

    e.printStackTrace(); // ADD THIS LINE HERE

    return ResponseEntity.status(HttpStatus.CONFLICT).body(
            Map.of("message",
                    "Could not save user. Check the backend console for the database error."));
}

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        if (email == null || password == null
                || !authService.login(email, password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Invalid email or password"));
        }

        AppUser user = authService.findByEmail(email);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "user", Map.of(
                                "id", user.getId(),
                                "fullName", user.getFullName(),
                                "email", user.getEmail(),
                                "role", user.getRole()
                        )
                )
        );
    }
}
