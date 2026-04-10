package auth_service.com.finatech.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.jwt")

public class JwtProperties {
    // Clé secrète encodée en Base64 — utilisée pour signer et valider les tokens JWT
    private String secret;
    // Durée de validité du token en millisecondes (28800000 ms = 8 heures)
    private long expiration;

}