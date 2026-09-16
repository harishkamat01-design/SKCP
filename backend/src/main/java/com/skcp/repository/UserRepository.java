package com.skcp.repository;

import com.skcp.entity.User;
import com.skcp.enums.RecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>
{
    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndStatus(
            String username,
            RecordStatus status
    );

    boolean existsByUsername(String username);
}