package com.finatech.ticket_service.controller;

import com.finatech.ticket_service.service.TicketStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST pour les statistiques des tickets
 * 
 * Fournit les endpoints pour obtenir des métriques et comptages
 * sur les tickets pour le dashboard et les KPI.
 * 
 * Base URL: /api/tickets
 * Authentification: JWT Token requis (configuré via Spring Security)
 * 
 * @author Finatech Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") // À configurer selon les besoins de sécurité
public class TicketStatsController {
    
    /**
     * Service pour les statistiques des tickets
     * Injecté automatiquement par Spring
     */
    @Autowired
    private TicketStatsService ticketStatsService;
    
    /**
     * Endpoint pour obtenir le nombre total de tickets
     * 
     * GET /api/tickets/count
     * 
     * Réponse attendue :
     * - Status: 200 OK
     * - Content-Type: application/json
     * - Body: Long (exemple: 42)
     * 
     * Cas d'erreur :
     * - 500 Internal Server Error si problème base de données
     * - 401 Unauthorized si JWT invalide/manquant
     * 
     * Utilisation frontend :
     * - KPI Cards du dashboard React
     * - Charts et graphiques de synthèse
     * - Métriques temps réel
     * 
     * @return ResponseEntity<Long> contenant le nombre total de tickets
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalTicketCount() {
        // TODO: L'utilisateur implémentera ici
        // TODO: Appeler ticketStatsService.getTotalTicketCount()
        // TODO: Gérer les exceptions avec try-catch
        // TODO: Retourner ResponseEntity.ok(count) en cas de succès
        // TODO: Retourner ResponseEntity.status(500).build() en cas d'erreur
        // TODO: Logger les erreurs si nécessaire
        // TODO: Exemple de structure :
        /*
        try {
            Long count = ticketStatsService.getTotalTicketCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            // Log error
            return ResponseEntity.status(500).build();
        }
        */
        return null; // L'utilisateur codera ici
    }
    
}