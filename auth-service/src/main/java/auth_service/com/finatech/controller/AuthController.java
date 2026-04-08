package auth_service.com.finatech.controller;

import auth_service.com.finatech.config.AdminProperties;
import auth_service.com.finatech.dto.AuthResponse;
import auth_service.com.finatech.dto.LoginRequest;
import auth_service.com.finatech.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {
    private final AdminProperties adminProperties;
    // Service JWT pour générer le token
    private final JwtService jwtService;
    // Endpoint de connexion : POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Vérifie si le username ET le password correspondent à ceux du YAML
        if (request.getUsername().equals(adminProperties.getUsername())
            && request.getPassword().equals(adminProperties.getPassword())) {
            // Génère un token JWT (8 hours)
            String token = jwtService.generateToken(request.getUsername());
            // Retourne 200 OK avec le token JWT
            return ResponseEntity.ok(new AuthResponse(token));
        }
        //  incorrects → 401 Unauthorized
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    }
}
