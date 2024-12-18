package hu.backend.service;

import hu.backend.dto.UserDTO;
import hu.backend.dto.response.UserReqRes;
import hu.backend.entity.Role;
import hu.backend.entity.User;
import hu.backend.repository.UserRepository;
import hu.backend.utils.JwtUtils;
import hu.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthService {
    private UserRepository userRepository;
    private JwtUtils jwtUtils;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private MapperUtils mapperUtils;

    public UserReqRes signUp(UserReqRes registrationRequest) {
        validateRequiredFields(registrationRequest);

        userRepository.findByEmail(registrationRequest.getEmail()).ifPresent(user -> {
            throw new IllegalArgumentException("User already exists");
        });
        UserReqRes userReqRes = new UserReqRes();
        User user = new User();

        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setRole(Role.USER);
        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());

        UserDTO userResult = mapperUtils.userToUserDTO(userRepository.save(user));
        userReqRes.setUserDTO(userResult);

        return userReqRes;
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken != null) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", null)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        String accessToken = request.getHeader("Authorization");

        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
            jwtUtils.blacklistAccessToken(accessToken);
        }
        SecurityContextHolder.clearContext();
    }

    public UserReqRes login(UserReqRes signInRequest, HttpServletResponse response) {
        UserReqRes responseDto = new UserReqRes();
        if (signInRequest.getEmail() == null || signInRequest.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (signInRequest.getPassword() == null || signInRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword()));
            User user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow();
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            responseDto.setToken(jwt);
            responseDto.setExpirationTime("1800");
        } catch (Exception e) {
            throw new IllegalArgumentException("Wrong email or password");
        }
        return responseDto;
    }

    public UserReqRes refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            throw new IllegalArgumentException("Refresh token is missing.");
        }

        String ourEmail = jwtUtils.exctractUserEmail(refreshToken);
        User user = userRepository.findByEmail(ourEmail).orElseThrow(
                () -> new IllegalArgumentException("User not found"));

        if (jwtUtils.isTokenValid(refreshToken, user)) {
            String newAccessToken = jwtUtils.generateToken(user);

            String newRefreshToken = jwtUtils.generateRefreshToken(Map.of(), user);

            ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            UserReqRes userReqRes = new UserReqRes();
            userReqRes.setToken(newAccessToken);
            userReqRes.setExpirationTime("18000");

            return userReqRes;
        } else {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
    }


    public UserReqRes createUser(final UserReqRes entity) {
        UserReqRes userReqRes = new UserReqRes();

        validateRequiredFields(entity);
        if (entity.getRole() == null || entity.getRole().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }

        userRepository.findByEmail(entity.getEmail()).ifPresent(user -> {
            throw new IllegalArgumentException("User already exists");
        });
        User user = new User();
        user.setEmail(entity.getEmail());
        user.setRole(Role.valueOf(entity.getRole().toUpperCase()));
        user.setPassword(passwordEncoder.encode(entity.getPassword()));
        user.setRole(Role.valueOf(entity.getRole().toUpperCase()));
        user.setFirstName(entity.getFirstName());
        user.setLastName(entity.getLastName());

        UserDTO userResult = mapperUtils.userToUserDTO(userRepository.save(user));
        userReqRes.setUserDTO(userResult);

        return userReqRes;
    }

    public UserReqRes updateUser(final Long id, final UserReqRes user) {
        if (user.getFirstName() == null || user.getFirstName().isEmpty()
                || user.getLastName() == null || user.getLastName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }

        User updateUser = userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("User not found with id " + id)
        );
        updateUser.setEmail(user.getEmail());
        updateUser.setRole(Role.valueOf(user.getRole().toUpperCase()));
        updateUser.setFirstName(user.getFirstName());
        updateUser.setLastName(user.getLastName());

        User updatedUser = userRepository.save(updateUser);
        UserReqRes updatedUserReqRes = new UserReqRes();

        updatedUserReqRes.setEmail(updatedUser.getEmail());
        updatedUserReqRes.setRole(updatedUser.getRole().name());

        return updatedUserReqRes;
    }

    private void validateRequiredFields(UserReqRes request) {
        if (request.getFirstName() == null || request.getFirstName().isEmpty()
                || request.getLastName() == null || request.getLastName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
    }

    public List<UserReqRes> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            UserReqRes userReqRes = new UserReqRes();
            UserDTO userDTO = mapperUtils.userToUserDTO(user);
            userReqRes.setUserDTO(userDTO);
            return userReqRes;
        }).collect(Collectors.toList());
    }

    public UserDTO findUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("User not found with id " + id)
        );
        UserDTO userDTO = mapperUtils.userToUserDTO(user);
        return userDTO;
    }

    public void deleteUser(final Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Product not found with id " + id)
        );

        userRepository.delete(user);
    }
}
