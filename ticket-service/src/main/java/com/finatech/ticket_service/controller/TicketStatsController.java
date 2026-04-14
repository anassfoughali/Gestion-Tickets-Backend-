package com.finatech.ticket_service.controller;

import com.finatech.ticket_service.service.impl.TicketImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketStatsController {

    private TicketImpl service;

    public TicketStatsController(TicketImpl service) {
        this.service = service;
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalTicketCount() {I 
        try {
            long count = service.Totale();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
