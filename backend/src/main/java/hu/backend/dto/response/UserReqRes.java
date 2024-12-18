package hu.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import hu.backend.dto.UserDTO;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserReqRes {
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String password;
    private UserDTO userDTO;
}
