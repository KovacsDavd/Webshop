package hu.backend.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String role;
    private String lastName;
    private String firstName;
}
