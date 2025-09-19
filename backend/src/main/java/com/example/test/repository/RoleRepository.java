package com.example.test.repository;

import com.example.test.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

    // TODO: You can add custom query methods here if needed.
}
