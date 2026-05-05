package com.finatech.ticket_service.controller;
import com.finatech.ticket_service.dto.*;
import com.finatech.ticket_service.service.TicketService;
import com.finatech.ticket_service.service.impl.TicketImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
import java.time.LocalDate;
 import java.time.format.DateTimeParseException;
 import lombok.extern.slf4j.Slf4j;

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
    @GetMapping("/evolution/filtred")
    @CrossOrigin
    public ResponseEntity<TicketEvolutionFilteredDTO> getTicketEvolutionFiltrerd(
            @RequestParam("dateDebut") String dateDebutStr,
            @RequestParam("dateFin") String dateFinStr,
            @RequestParam("priorite") String priorite
    ) {
        try {
            LocalDate dateDebut = LocalDate.parse(dateDebutStr);
            LocalDate dateFin = LocalDate.parse(dateFinStr);

            if (dateFin.isBefore(dateDebut)) {
                log.error("dateFin doit être >= dateDebut");
                return ResponseEntity.badRequest().build();
            }

            TicketEvolutionFilteredDTO result =
                    ticketImpl.getTicketEvolutionFiltred(dateDebut, dateFin, priorite);

            return ResponseEntity.ok(result);

        } catch (DateTimeParseException e) {

            log.error("Erreur de format de date", e);
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {

            log.error("Erreur lors de la récupération des tickets filtrés", e);
            return ResponseEntity.internalServerError().build();
        }
    }

}

