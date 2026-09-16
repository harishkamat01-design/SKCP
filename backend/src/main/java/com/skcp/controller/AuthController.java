package com.skcp.controller;

import com.skcp.dto.request.auth.LoginRequest;
import com.skcp.dto.response.auth.LoginResponse;
import com.skcp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController
{
    private final AuthService authService;

    public AuthController(AuthService authService)
    {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    )
    {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}