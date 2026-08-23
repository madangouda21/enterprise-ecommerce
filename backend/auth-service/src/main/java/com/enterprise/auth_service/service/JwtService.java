package com.enterprise.auth_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "4b4d5a7751335736763979244226452948404d635166546a576e5a723475377821";


    // =====================================================
    // EXTRACT USERNAME
    // =====================================================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    // =====================================================
    // EXTRACT CLAIM
    // =====================================================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }


    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    public String generateToken(
            UserDetails userDetails) {

        Map<String, Object> claims =
                new HashMap<>();

        // Add user role to JWT
        claims.put(
                "role",
                userDetails
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority()
        );

        return generateToken(
                claims,
                userDetails
        );
    }


    // =====================================================
    // GENERATE TOKEN WITH CLAIMS
    // =====================================================

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails) {

        return Jwts.builder()

                .claims(extraClaims)

                .subject(
                        userDetails.getUsername()
                )

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60 * 24
                        )
                )

                .signWith(
                        getSignInKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }


    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        )
                && !isTokenExpired(token);
    }


    // =====================================================
    // CHECK EXPIRATION
    // =====================================================

    private boolean isTokenExpired(
            String token) {

        return extractExpiration(token)
                .before(new Date());
    }


    // =====================================================
    // EXTRACT EXPIRATION
    // =====================================================

    private Date extractExpiration(
            String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }


    // =====================================================
    // EXTRACT ALL CLAIMS
    // =====================================================

    private Claims extractAllClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(
                        getSignInKey()
                )

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }


    // =====================================================
    // SIGNING KEY
    // =====================================================

    private SecretKey getSignInKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        SECRET_KEY
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }
}