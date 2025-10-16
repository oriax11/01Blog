package com.example.test.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String name;

    public UserDTO() {
    }

    public UserDTO(UUID id, String username, String email, String name) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
    }
}
