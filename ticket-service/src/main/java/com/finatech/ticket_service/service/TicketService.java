package com.finatech.ticket_service.service;
import com.finatech.ticket_service.model.Settings;
import com.finatech.ticket_service.model.Ticket;
import com.finatech.ticket_service.repository.SettingsRepo;
import com.finatech.ticket_service.repository.TicketRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepo ticketRepo;
    private final SettingsRepo settingsRepo;

    /**
     * Récupère tous les tickets avec le matchcode appliqué
     * Transforme les IDs (statusId, priorityId, issueTypeId) en descriptions lisibles
     */
    public List<Ticket> getAllTicketsWithMatchcode() {

        // 1. Récupérer tous les tickets
        List<Ticket> tickets = ticketRepo.findAll();
        
        // 2. Récupérer tous les settings (matchcode)
        List<Settings> settings = settingsRepo.findAll();
        
        // 3. Appliquer le matchcode à chaque ticket
        for (Ticket ticket : tickets) {
            ticket.applyMatchcode(settings);
        }
        
        return tickets;
    }

    /**
     * Récupère un ticket par ID avec le matchcode appliqué
     */
    public Ticket getTicketByIdWithMatchcode(long ticketId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));
        
        List<Settings> settings = settingsRepo.findAll();
        ticket.applyMatchcode(settings);
        
        return ticket;
    }
}
