package com.finatech.ticket_service;

import com.finatech.ticket_service.model.Settings;
import com.finatech.ticket_service.model.Ticket;
import com.finatech.ticket_service.repository.SettingsRepo;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TicketBusinessValidationTest {

    @Autowired
    private TicketRepo ticketRepository;

    @Autowired
    private SettingsRepo settingsRepo;

    @Autowired
    private TicketService ticketService;

    @Test
    void validateTicketFieldsExist() {
        List<Ticket> tickets = ticketRepository.findAll();

        assertFalse(tickets.isEmpty(), "No tickets found in database");

        for (Ticket t : tickets) {
            assertNotNull(t.getId(), "Ticket ID is null");
            assertTrue(t.getStatusId() > 0, "StatusId should be > 0 for ticket ID: " + t.getId());
            assertTrue(t.getIssueTypeId() > 0, "IssueTypeId should be > 0 for ticket ID: " + t.getId());
            assertTrue(t.getPriorityId() > 0, "PriorityId should be > 0 for ticket ID: " + t.getId());
        }

        System.out.println("✅ All tickets have valid ID fields");
    }

    @Test
    void validateMatchcodeApplication() {
        // 1. Récupérer les tickets et settings
        List<Ticket> tickets = ticketRepository.findAll();
        List<Settings> settings = settingsRepo.findAll();

        assertFalse(tickets.isEmpty(), "No tickets found");
        assertFalse(settings.isEmpty(), "No settings found");

        System.out.println("📊 Found " + tickets.size() + " tickets and " + settings.size() + " settings");

        // 2. Appliquer le matchcode manuellement
        for (Ticket ticket : tickets) {
            ticket.applyMatchcode(settings);
        }

        // 3. Vérifier qu'au moins un ticket a des descriptions remplies
        boolean hasStatusDescription = false;
        boolean hasTypeDescription = false;
        boolean hasPriorityDescription = false;

        for (Ticket ticket : tickets) {
            if (ticket.getStatusDescription() != null) {
                hasStatusDescription = true;
                System.out.println("✅ Ticket " + ticket.getId() + " - Status: " + ticket.getStatusId() + " → " + ticket.getStatusDescription());
            }
            if (ticket.getIssueTypeDescription() != null) {
                hasTypeDescription = true;
                System.out.println("✅ Ticket " + ticket.getId() + " - Type: " + ticket.getIssueTypeId() + " → " + ticket.getIssueTypeDescription());
            }
            if (ticket.getPriorityDescription() != null) {
                hasPriorityDescription = true;
                System.out.println("✅ Ticket " + ticket.getId() + " - Priority: " + ticket.getPriorityId() + " → " + ticket.getPriorityDescription());
            }
        }

        assertTrue(hasStatusDescription || hasTypeDescription || hasPriorityDescription, 
                "Matchcode should populate at least one description field");

        System.out.println("✅ Matchcode application validated successfully");
    }

    @Test
    void validateTicketServiceMatchcode() {
        // Tester le service qui applique automatiquement le matchcode
        List<Ticket> ticketsWithMatchcode = ticketService.getAllTicketsWithMatchcode();

        assertFalse(ticketsWithMatchcode.isEmpty(), "Service should return tickets");

        // Vérifier qu'au moins un ticket a le matchcode appliqué
        boolean hasMatchcode = ticketsWithMatchcode.stream()
                .anyMatch(t -> t.getStatusDescription() != null 
                        || t.getIssueTypeDescription() != null 
                        || t.getPriorityDescription() != null);

        assertTrue(hasMatchcode, "At least one ticket should have matchcode descriptions");

        // Afficher quelques exemples
        ticketsWithMatchcode.stream()
                .limit(3)
                .forEach(ticket -> {
                    System.out.println("🎫 Ticket ID: " + ticket.getId());
                    System.out.println("   Status: " + ticket.getStatusId() + " → " + ticket.getStatusDescription());
                    System.out.println("   Type: " + ticket.getIssueTypeId() + " → " + ticket.getIssueTypeDescription());
                    System.out.println("   Priority: " + ticket.getPriorityId() + " → " + ticket.getPriorityDescription());
                });

        System.out.println("✅ TicketService matchcode validated successfully");
    }

    @Test
    void validateSettingsStructure() {
        // Vérifier que les settings ont la bonne structure
        List<Settings> settings = settingsRepo.findAll();

        assertFalse(settings.isEmpty(), "Settings table should not be empty");

        // Vérifier qu'on a des settings pour Status (Setting=1), IssueType (Setting=2), Priority (Setting=3)
        boolean hasStatusSettings = settings.stream().anyMatch(s -> s.getSettings() == 1);
        boolean hasTypeSettings = settings.stream().anyMatch(s -> s.getSettings() == 2);
        boolean hasPrioritySettings = settings.stream().anyMatch(s -> s.getSettings() == 3);

        System.out.println("📋 Settings breakdown:");
        System.out.println("   Status settings (Setting=1): " + hasStatusSettings);
        System.out.println("   Type settings (Setting=2): " + hasTypeSettings);
        System.out.println("   Priority settings (Setting=3): " + hasPrioritySettings);

        assertTrue(hasStatusSettings || hasTypeSettings || hasPrioritySettings, 
                "Settings should contain at least one matchcode type");

        System.out.println("✅ Settings structure validated");
    }
}
