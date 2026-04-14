package com.finatech.ticket_service.controller;
import com.finatech.ticket_service.dto.TempsResolutionDTO;
import com.finatech.ticket_service.dto.TicketsEnCoursDTO;
import com.finatech.ticket_service.dto.TicketsOuvertsDTO;
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

    // GET /api/tickets/total — JPA
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalTickets() {
        return ResponseEntity.ok(ticketService.getTotalTickets());
    }

    //  GET /api/tickets/ouverts — SQL natif
    @GetMapping("/ouverts")
    public ResponseEntity<TicketsOuvertsDTO> getTicketsOuverts() {
        return ResponseEntity.ok(ticketService.getTicketsOuverts());
    }

    //  GET /api/tickets/en-cours — SQL natif
    @GetMapping("/en-cours")
    public ResponseEntity<TicketsEnCoursDTO> getTicketsEnCours() {
        return ResponseEntity.ok(ticketService.getTicketsEnCours());
    }

    //  GET /api/tickets/temps-resolution — SQL natif
    @GetMapping("/temps-resolution")
    public ResponseEntity<List<TempsResolutionDTO>> getTempsResolution() {
        return ResponseEntity.ok(ticketService.getTempsResolutionParTechnicien());
    }

    // GET /api/tickets/count - JPA 
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalTicketCount() {
        try {
            long count = ticketImpl.Totale();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}