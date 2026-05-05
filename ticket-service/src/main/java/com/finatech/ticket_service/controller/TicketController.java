package com.finatech.ticket_service.controller;
import com.finatech.ticket_service.dto.*;
import com.finatech.ticket_service.service.TicketService;
import com.finatech.ticket_service.service.impl.TicketImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// TODO: Ajouter les imports nécessaires pour la nouvelle fonctionnalité
// import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
// import java.time.LocalDate;
// import java.time.format.DateTimeParseException;
// import lombok.extern.slf4j.Slf4j;

// TODO: Ajouter l'annotation @Slf4j pour le logging
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketImpl ticketImpl;

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalTickets() {
        return ResponseEntity.ok(ticketService.getTotalTickets());
    }

    @GetMapping("/ouverts")
    public ResponseEntity<TicketsOuvertsDTO> getTicketsOuverts() {
        return ResponseEntity.ok(ticketService.getTicketsOuverts());
    }

    @GetMapping("/en-cours")
    public ResponseEntity<TicketsEnCoursDTO> getTicketsEnCours() {
        return ResponseEntity.ok(ticketService.getTicketsEnCours());
    }

    @GetMapping("/temps-resolution")
    public ResponseEntity<List<TempsResolutionDTO>> getTempsResolution() {
        return ResponseEntity.ok(ticketService.getTempsResolutionParTechnicien());
    }

    @GetMapping("/resolus")
    public ResponseEntity<TicketsResolusDTO> getTicketsResolus() {
        return ResponseEntity.ok(ticketService.getTicketsResolus());
    }

    @GetMapping("/clotures")
    public ResponseEntity<TicketsClouresDTO> getTicketsClotures() {
        return ResponseEntity.ok(ticketService.getTicketsClotures());
    }

    @GetMapping("/ouverts/par-technicien")
    public ResponseEntity<List<TicketsOuvertsParTechnicienDTO>> getTicketsOuvertsParTechnicien() {
        return ResponseEntity.ok(ticketService.getTicketsOuvertsParTechnicien());
    }

    @GetMapping("/resolution")
    public ResponseEntity<TempsResolutionMoyenDTO> getTempsResolutionMoyen() {
        try {
            return ResponseEntity.ok(ticketImpl.TempsResolutionMoyen());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/stats-par-jour")
    public ResponseEntity<List<TicketEvolutionParJourDTO>> getEvolutionTicket(){
        try {
            List<TicketEvolutionParJourDTO> data = ticketImpl.getEvolutionParJour() ;
            return ResponseEntity.ok(data) ;
        }catch (Exception e){
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/list")
    public ResponseEntity<List<TicketCompletDTO>> getTicketsDetails(){
        try{
            List<TicketCompletDTO> tickets = ticketImpl.getTicketDetails();
            return ResponseEntity.ok(tickets);
        }catch (Exception e ){
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/top-techniciens")
    public ResponseEntity<List<TopTechnicienDTO>> getTop5TechniciensByClotures(){
        try{
            List<TopTechnicienDTO> topTechniciens = ticketImpl.getTop5TechniciensByClotures();
            return ResponseEntity.ok(topTechniciens);
        }catch (Exception e ){
            return ResponseEntity.status(500).build();
        }
    }

    // ========================================================================
    // NOUVELLE FONCTIONNALITÉ : FILTRAGE PAR INTERVALLE DE DATES ET PRIORITÉ
    // ========================================================================

    // TODO: Créer le nouveau endpoint GET /evolution/filtered
    // - Ajouter l'annotation @GetMapping("/evolution/filtered")
    // - Ajouter l'annotation @CrossOrigin si nécessaire pour permettre les requêtes depuis le frontend
    //
    // SIGNATURE DE LA MÉTHODE :
    // - Nom : getTicketEvolutionFiltered
    // - Type de retour : ResponseEntity<TicketEvolutionFilteredDTO>
    // - Paramètres (tous avec @RequestParam) :
    //   * @RequestParam("dateDebut") String dateDebutStr : date de début au format "yyyy-MM-dd"
    //   * @RequestParam("dateFin") String dateFinStr : date de fin au format "yyyy-MM-dd"
    //   * @RequestParam("priorite") String priorite : priorité à filtrer
    //
    // LOGIQUE DU CONTROLLER :
    //
    // ÉTAPE 1 : VALIDATION ET CONVERSION DES DATES
    // - Entourer le code dans un bloc try-catch
    // - Logger la réception de la requête avec log.info("Requête reçue - dateDebut: {}, dateFin: {}, priorite: {}", dateDebutStr, dateFinStr, priorite)
    //
    // - Convertir dateDebutStr en LocalDate :
    //   * Utiliser LocalDate.parse(dateDebutStr)
    //   * Stocker dans une variable LocalDate dateDebut
    //
    // - Convertir dateFinStr en LocalDate :
    //   * Utiliser LocalDate.parse(dateFinStr)
    //   * Stocker dans une variable LocalDate dateFin
    //
    // ÉTAPE 2 : APPEL DU SERVICE
    // - Appeler ticketImpl.getTicketEvolutionFiltered(dateDebut, dateFin, priorite)
    // - Stocker le résultat dans une variable TicketEvolutionFilteredDTO result
    //
    // ÉTAPE 3 : RETOUR DE LA RÉPONSE
    // - Logger le succès avec log.info("Réponse envoyée avec succès")
    // - Retourner ResponseEntity.ok(result)
    //
    // ÉTAPE 4 : GESTION DES EXCEPTIONS
    // - Catch DateTimeParseException :
    //   * Logger l'erreur avec log.error("Erreur de format de date", exception)
    //   * Retourner ResponseEntity.badRequest().build() (code 400)
    //
    // - Catch IllegalArgumentException :
    //   * Logger l'erreur avec log.error("Paramètres invalides", exception)
    //   * Retourner ResponseEntity.badRequest().build() (code 400)
    //
    // - Catch Exception générale :
    //   * Logger l'erreur avec log.error("Erreur serveur", exception)
    //   * Retourner ResponseEntity.status(500).build()
    //
    // EXEMPLE D'URL ATTENDUE :
    // GET http://localhost:8083/api/tickets/evolution/filtered?dateDebut=2024-01-01&dateFin=2024-12-31&priorite=HAUTE
    //
    // EXEMPLE DE RÉPONSE JSON :
    // {
    //   "nombreTicketsArrivés": 150,
    //   "nombreTicketsClotures": 120,
    //   "dateDebut": "2024-01-01",
    //   "dateFin": "2024-12-31",
    //   "priorite": "HAUTE"
    // }

}

