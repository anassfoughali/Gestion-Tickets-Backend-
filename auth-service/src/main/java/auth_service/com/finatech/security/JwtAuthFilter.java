package auth_service.com.finatech.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor

public class JwtAuthFilter extends OncePerRequestFilter{
    // Service JWT pour valider  les tokens
    private final JwtService jwtService;
    // filtre / appelée pour chaque requéte HTTP
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain
                                    )
        throws ServletException , IOException{
        // Format attendu : "Bearer <token>"
        final String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("bearer"))  {
            filterChain.doFilter(request , response);
            return;
        }
        // Extrait le token JWT
        final String token = authHeader.substring(7);
        try {
            // Extrait le nom d'utilisateur depuis le token
            final String username = jwtService.extractUsername(token);
            // Vérifie que le username est valide
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(token , username)) {
                    // Crée un objet d'authentification Spring Security avec le rôle ADMIN
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    );
                    // Enregistre l'authentification
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }catch (Exception e) {
            // Si le token est invalide ou expiré : retourner 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        // Passe la requête au filtre
        filterChain.doFilter(request , response);

    }
}
