package com.finatech.ticket_service.controller;

import com.finatech.ticket_service.dto.*;
import com.finatech.ticket_service.service.TicketService;
import com.finatech.ticket_service.service.impl.TicketImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
// TODO: Ajouter endpoint GET /stats-par-jour
// - @GetMapping("/stats-par-jour")
// - ResponseEntity<List<TicketEvolutionParJourDTO>>
// - try/catch: return ResponseEntity.ok(data) ou status(500)
// - Appeler ticketImpl.getEvolutionParJour()