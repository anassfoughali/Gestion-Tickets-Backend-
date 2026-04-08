package auth_service.com.finatech.security;

import auth_service.com.finatech.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
@RequiredArgsConstructor

public class JwtService {
    // Propriétés JWT lues depuis application.yaml
    private final JwtProperties jwtProperties;

    public String generateToken(String username){
        return Jwts.builder()
                //  token = nom d'utilisateur
                .setSubject(username)
                // Date de création = maintenant
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Date d'expiration = maintenant + 8h
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                // Signature avec la clé secrète  HS256
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                // token final en String
                .compact();
    }
    // Extrait le nom d'utilisateur contenu dans un token JWT.
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }
    // Verifie si un token JWT est valide
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }
    // Vérifie si la date d'expiration du token est dépassée
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // Utilise  clé secrète pour vérifier la signature
                .build()
                .parseClaimsJws(token)// valide le token
                .getBody();// Retourne le contenu
    }

    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret()); // Décode la clé secrète
        return Keys.hmacShaKeyFor(keyBytes); // Crée une clé  à partir des bytes

    }
}
