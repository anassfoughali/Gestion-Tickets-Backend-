package com.finatech.ticket_service;

import com.finatech.ticket_service.dto.TempsResolutionDTO;
import com.finatech.ticket_service.dto.TicketsEnCoursDTO;
import com.finatech.ticket_service.dto.TicketsOuvertsDTO;
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
        List<Ticket> tickets = ticketRepository.findAll();
        List<Settings> settings = settingsRepo.findAll();

        assertFalse(tickets.isEmpty(), "No tickets found");
        assertFalse(settings.isEmpty(), "No settings found");

        System.out.println("📊 Found " + tickets.size() + " tickets and " + settings.size() + " settings");

        for (Ticket ticket : tickets) {
            ticket.applyMatchcode(settings);
        }

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
            }
            if (ticket.getPriorityDescription() != null) {
                hasPriorityDescription = true;
            }
        }

        assertTrue(hasStatusDescription || hasTypeDescription || hasPriorityDescription,
                "Matchcode should populate at least one description field");

        System.out.println("✅ Matchcode application validated successfully");
    }

    // ✅ Test remplacé — utilise les nouvelles méthodes du service
    @Test
    void validateTicketServiceMatchcode() {

        // ✅ Test API 1 — Tickets ouverts
        TicketsOuvertsDTO ouverts = ticketService.getTicketsOuverts();
        assertNotNull(ouverts, "Tickets ouverts should not be null");
        assertTrue(ouverts.getNombreTicketsOuverts() >= 0, "Count should be >= 0");
        System.out.println("✅ Tickets ouverts : " + ouverts.getNombreTicketsOuverts());

        // ✅ Test API 2 — Tickets en cours
        TicketsEnCoursDTO enCours = ticketService.getTicketsEnCours();
        assertNotNull(enCours, "Tickets en cours should not be null");
        assertTrue(enCours.getNombreTicketsEnCours() >= 0, "Count should be >= 0");
        System.out.println("✅ Tickets en cours : " + enCours.getNombreTicketsEnCours());

        // ✅ Test API 3 — Temps résolution par technicien
        List<TempsResolutionDTO> tempsResolution = ticketService.getTempsResolutionParTechnicien();
        assertNotNull(tempsResolution, "Temps resolution should not be null");
        System.out.println("✅ Techniciens : " + tempsResolution.size());
        tempsResolution.forEach(t ->
                System.out.println("   " + t.getTechnicien() + " → " + t.getTempsMoyenHeures() + "h")
        );

        // ✅ Test Total — JPA pur
        long total = ticketService.getTotalTickets();
        assertTrue(total > 0, "Total tickets should be > 0");
        System.out.println("✅ Total tickets : " + total);
    }

    @Test
    void validateSettingsStructure() {
        List<Settings> settings = settingsRepo.findAll();

        assertFalse(settings.isEmpty(), "Settings table should not be empty");

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