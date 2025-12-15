package com.example.test.utils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.test.service.UserService;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;

    public AdminInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        userService.createAdmin("admin", "admin","admin@example.com", "StrongPassword123");
    }
}
