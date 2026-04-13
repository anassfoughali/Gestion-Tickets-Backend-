package auth_service.com.finatech.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor

public class AuthResponse {
    // Le token JWT généré après authentification réussie
    private String token;

}