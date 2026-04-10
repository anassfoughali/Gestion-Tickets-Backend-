package auth_service.com.finatech.dto;

import lombok.Data;

@Data

public class LoginRequest {
    // Nom d'utilisateur envoyé par le client
    private String username;
    // Mot de passe envoyé par le client
    private String password;

}