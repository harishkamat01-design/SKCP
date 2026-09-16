package com.skcp.service;

import com.skcp.dto.request.auth.LoginRequest;
import com.skcp.dto.response.auth.LoginResponse;
import com.skcp.entity.User;
import com.skcp.enums.RecordStatus;
import com.skcp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import com.skcp.exception.InvalidCredentialsException;

import java.time.Instant;

@Service
public class AuthService
{
    private static final long TOKEN_VALIDITY_SECONDS = 8 * 60 * 60;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder
    )
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public LoginResponse login(LoginRequest request)
    {
        User user = userRepository
                .findByUsernameAndStatus(
                        request.getUsername(),
                        RecordStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid username or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        ))
        {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (!user.getRole().name().equals(request.getRole()))
        {
            throw new InvalidCredentialsException(
                    "Selected role does not match user role"
            );
        }

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("SKCP")
                .subject(user.getUsername())
                .issuedAt(now)
                .expiresAt(
                        now.plusSeconds(TOKEN_VALIDITY_SECONDS)
                )
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .build();

        String token = jwtEncoder
                .encode(
                        JwtEncoderParameters.from(claims)
                )
                .getTokenValue();

        return new LoginResponse(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}



/* package com.skcp.service;

import com.skcp.dto.request.auth.LoginRequest;
import com.skcp.dto.response.auth.LoginResponse;
import com.skcp.entity.User;
import com.skcp.enums.RecordStatus;
import com.skcp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    )
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request)
    {
        User user = userRepository
                .findByUsernameAndStatus(
                        request.getUsername(),
                        RecordStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        ))
        {
            throw new RuntimeException("Invalid username or password");
        }

        if (!user.getRole().name().equals(request.getRole()))
        {
            throw new RuntimeException("Selected role does not match user role");
        }

        return new LoginResponse(
                null,
                user.getUserId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}
*/