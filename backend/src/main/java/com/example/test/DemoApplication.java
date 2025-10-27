package com.example.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.test.model.Role;
import com.example.test.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initRoles(RoleRepository roleRepository) {
		return args -> {
			if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
				Role adminRole = new Role();
				adminRole.setName("ROLE_ADMIN");
				roleRepository.save(adminRole);
			}

			if (roleRepository.findByName("ROLE_USER").isEmpty()) {
				Role userRole = new Role();
				userRole.setName("ROLE_USER");
				roleRepository.save(userRole);
			}
		};
	}

}
