package hu.backend.controller;

import hu.backend.dto.UserDTO;
import hu.backend.dto.response.UserReqRes;
import hu.backend.entity.User;
import hu.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class UserController {
    private final AuthService authService;

    @PostMapping("/auth/signup")
    public ResponseEntity<UserReqRes> signUp(@RequestBody UserReqRes registrationRequest) {
        return ResponseEntity.ok(authService.signUp(registrationRequest));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserReqRes> login(@RequestBody UserReqRes loginRequest, HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(loginRequest, response));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok("Sikeres kijelentkezés");
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserReqRes> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(authService.refreshToken(request, response));
    }

    @GetMapping("/auth/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        return ResponseEntity.ok(true);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserReqRes>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/auth/role")
    public ResponseEntity<String> getRoleByUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user.getRole().name());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.findUserById(id));
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable final Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserReqRes> updateUser(@PathVariable final Long id, @RequestBody final UserReqRes user) {
        return new ResponseEntity<>(authService.updateUser(id, user), HttpStatus.OK);
    }
}
