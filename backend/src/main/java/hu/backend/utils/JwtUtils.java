package hu.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtils {
    private final SecretKey secretKey;
    private static final Long ACCESS_TOKEN_EXPIRATION_TIME = 18000L;
    private static final Long REFRESH_TOKEN_EXPIRATION_TIME = 36000L;

    private final Set<String> blacklistedTokens = new HashSet<>();

    public JwtUtils(@Value("${app.security.secret-key}") String stringSecretKey) {
        byte[] keyBytes = Base64.getDecoder().decode(stringSecretKey.getBytes(StandardCharsets.UTF_8));
        this.secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public boolean isAccessTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void blacklistAccessToken(String token) {
        blacklistedTokens.add(token);
    }

    public String generateToken(UserDetails user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME * 1000))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(Map<String, Object> claims, UserDetails user) {
        return Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME * 1000))
                .signWith(secretKey)
                .compact();
    }

    public String exctractUserEmail(String token) {
        return exctractClaims(token, Claims::getSubject);
    }

    private <T> T exctractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(Jwts.parser().verifyWith(secretKey)
                .build().parseSignedClaims(token).getPayload());
    }

    public boolean isTokenValid(String token, UserDetails user) {
        final String userEmail = exctractUserEmail(token);
        return (userEmail.equals(user.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return exctractClaims(token, Claims::getExpiration).before(new Date());
    }
}
