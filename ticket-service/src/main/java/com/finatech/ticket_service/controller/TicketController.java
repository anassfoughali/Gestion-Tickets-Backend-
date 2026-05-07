package com.finatech.ticket_service.controller;
import com.finatech.ticket_service.dto.*;
import com.finatech.ticket_service.service.TicketService;
import com.finatech.ticket_service.service.impl.TicketImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.format.DateTimeParseException;
import java.util.List;
import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
import java.time.LocalDate;
@Slf4j
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
    @GetMapping("/evolution/filtered")
    public ResponseEntity<List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO>> getTicketEvolutionFiltered(
            @RequestParam("dateDebut") String dateDebutStr,
            @RequestParam("dateFin") String dateFinStr,
            @RequestParam("priorite") String priorite
    ) {
        try {
            log.info("Requête reçue - dateDebut: {}, dateFin: {}, priorite: {}", dateDebutStr, dateFinStr, priorite);
            
            LocalDate dateDebut = LocalDate.parse(dateDebutStr);
            LocalDate dateFin = LocalDate.parse(dateFinStr);

            if (dateFin.isBefore(dateDebut)) {
                log.error("dateFin doit être >= dateDebut");
                return ResponseEntity.badRequest().build();
            }

            List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> result =
                    ticketImpl.getTicketEvolutionFilteredSimple(dateDebut, dateFin, priorite);

            log.info("Réponse envoyée avec succès");
            return ResponseEntity.ok(result);
        } catch (DateTimeParseException e) {
            log.error("Erreur de format de date", e);
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            log.error("Paramètres invalides", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des tickets filtrés", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/produits/changements")
    public ResponseEntity<List<ProductChangementDTO>> getProduitsAvecNombreChangements(){
        try {
            List<ProductChangementDTO> producttable = ticketImpl.getProduitsAvecNombreChangements() ;
            return ResponseEntity.ok(producttable);
        }      catch (Exception e ){
            log.error("Erreur getProduitsAvecNombreChangements" , e );
            return ResponseEntity.status(500).build() ;
        }
    }

    @GetMapping("/produits/clients")
    public ResponseEntity<List<ProductClientDTO>> getIssuesWithProductAndClient(){
        try {
            List<ProductClientDTO> produit_client  = ticketImpl.getIssuesWithProductAndClient();
            return ResponseEntity.ok(produit_client);
        }catch(Exception e ){
            log.error("Erreur de getIssuesWithProductAndClient " , e );
            return ResponseEntity.status(500).build();
        }

    }
    // top3-zero-changement
    @GetMapping("/produits/top3-zero-changement")
    public ResponseEntity<List<ProductChangementDTO>> getTop3Produitwithzerochangement(){
        try {
            List<ProductChangementDTO> produitlist = ticketImpl.getTop3ProduitsZeroChangement();
            return ResponseEntity.ok(produitlist);
        }catch (Exception e ){
            log.error("Erreur de getTop3Produitwithzerochangement");
            return ResponseEntity.status(500).build() ;
        }
    }

}

