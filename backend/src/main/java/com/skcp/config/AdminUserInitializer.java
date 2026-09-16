package com.skcp.config;

import com.skcp.entity.User;
import com.skcp.enums.RecordStatus;
import com.skcp.enums.Role;
import com.skcp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminUserInitializer
{
    @Bean
    public CommandLineRunner initializeStaffUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${SKCP_ADMIN_PASSWORD:}") String adminPassword,
            @Value("${SKCP_PRODUCTION_MANAGER_PASSWORD:}") String productionManagerPassword,
            @Value("${SKCP_B2B_PASSWORD:}") String b2bPassword,
            @Value("${SKCP_STORE_MANAGER_PASSWORD:}") String storeManagerPassword,
            @Value("${SKCP_LOGISTICS_PASSWORD:}") String logisticsPassword
    )
    {
        return args ->
        {
            createUser(
                    userRepository,
                    passwordEncoder,
                    "admin",
                    adminPassword,
                    Role.ADMIN
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "production_manager",
                    productionManagerPassword,
                    Role.PRODUCTION_MANAGER
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "b2b",
                    b2bPassword,
                    Role.B2B
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "store_manager",
                    storeManagerPassword,
                    Role.STORE_MANAGER
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "logistics",
                    logisticsPassword,
                    Role.LOGISTICS
            );
        };
    }

        private void createUser(
                UserRepository userRepository,
                PasswordEncoder passwordEncoder,
                String username,
                String password,
                Role role
        )
        {
        if (userRepository.existsByUsername(username))
        {
                return;
        }

        if (password == null || password.isBlank())
        {
                throw new IllegalStateException(
                        "Password is not configured for user: " + username
                );
        }

        User user = new User();

        user.setUsername(username);
        user.setPasswordHash(
                passwordEncoder.encode(password)
        );
        user.setRole(role);
        user.setStatus(RecordStatus.ACTIVE);

        userRepository.save(user);
        }
}