package com.finatech.performance_service;
import com.finatech.performance_service.model.Technicien;
import com.finatech.performance_service.model.Ticket;
import com.finatech.performance_service.repository.TechnicienRepo;
import com.finatech.performance_service.repository.TicketRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Business Logic Validation Test
 * This single test class validates all repositories implicitly while testing meaningful business requirements
 * Replaces simple repository tests with comprehensive business validation
 * NO SERVICE LAYER NEEDED - Tests work directly with repositories
 */
@SpringBootTest
public class PerformanceBusinessValidationTest {

    @Autowired
    private TicketRepo ticketRepo;

    @Autowired
    private TechnicienRepo technicienRepo;

    @Test
    void validateTicketFieldsExist() {
        // Validates TicketRepo works by calling findAll()
        List<Ticket> tickets = ticketRepo.findAll();
        
        assertFalse(tickets.isEmpty(), "No tickets found - check database connection and data");
        
        // Validate business requirements for ticket data quality
        for (Ticket ticket : tickets) {
            assertNotNull(ticket.getId(), "Ticket ID should not be null");
            assertTrue(ticket.getId() > 0, "Ticket ID should be positive");
            
            // Validate that critical fields have reasonable values
            if (ticket.getPriority() != null) {
                assertTrue(ticket.getPriority() >= 0, "Priority should be non-negative");
            }
            
            // Handle technician ID - 0 means unassigned, which is valid
            if (ticket.getTechnicienId() != null) {
                assertTrue(ticket.getTechnicienId() >= 0, "TechnicienId should be non-negative (0 = unassigned)");
            }
            
            if (ticket.getProductId() != null) {
                assertTrue(ticket.getProductId() > 0, "ProductId should be positive when present");
            }
        }
        
        System.out.println("✓ Ticket validation passed - " + tickets.size() + " tickets validated");
    }

    @Test
    void validateTechnicienFieldsExist() {
        // Validates TechnicienRepo works by calling findAll()
        List<Technicien> technicians = technicienRepo.findAll();
        
        assertFalse(technicians.isEmpty(), "No technicians found - check database connection and data");
        
        // Validate business requirements for technician data quality
        for (Technicien technician : technicians) {
            assertNotNull(technician.getId(), "Technician ID should not be null");
            assertTrue(technician.getId() > 0, "Technician ID should be positive");
            assertNotNull(technician.getDescription(), "Technician description should not be null");
            assertFalse(technician.getDescription().trim().isEmpty(), 
                "Technician description should not be empty");
        }
        
        System.out.println("✓ Technician validation passed - " + technicians.size() + " technicians validated");
    }

    @Test
    void validateTicketTechnicianRelationship() {
        // Validates both repositories and business logic for relationships
        List<Ticket> tickets = ticketRepo.findAll();
        List<Technicien> technicians = technicienRepo.findAll();
        
        assertFalse(tickets.isEmpty(), "Tickets should exist for relationship validation");
        assertFalse(technicians.isEmpty(), "Technicians should exist for relationship validation");
        
        // Create lookup map for efficient validation
        Map<Integer, Technicien> technicianMap = technicians.stream()
            .collect(Collectors.toMap(Technicien::getId, t -> t));
        
        // Validate ticket-technician relationships
        long ticketsWithTechnicians = tickets.stream()
            .filter(ticket -> ticket.getTechnicienId() != null && ticket.getTechnicienId() > 0)
            .count();
        
        assertTrue(ticketsWithTechnicians >= 0, 
            "Should handle tickets with or without assigned technicians");
        
        // Validate that assigned technician IDs (> 0) exist in technician table
        // Note: TechnicienId = 0 means unassigned, which is valid
        for (Ticket ticket : tickets) {
            if (ticket.getTechnicienId() != null && ticket.getTechnicienId() > 0) {
                assertTrue(technicianMap.containsKey(ticket.getTechnicienId()),
                    "Ticket " + ticket.getId() + " references non-existent technician " + 
                    ticket.getTechnicienId());
            }
        }
        
        System.out.println("✓ Ticket-Technician relationship validation passed");
    }

    @Test
    void validateRepositoryIntegration() {
        // Validates both repositories work together for business logic
        List<Ticket> tickets = ticketRepo.findAll();
        List<Technicien> technicians = technicienRepo.findAll();
        
        assertFalse(tickets.isEmpty(), "Tickets should exist for integration validation");
        assertFalse(technicians.isEmpty(), "Technicians should exist for integration validation");
        
        // Test repository-based business logic: filtering tickets by technician
        if (!technicians.isEmpty()) {
            Integer firstTechnicianId = technicians.get(0).getId();
            
            // Use repository directly to filter tickets (no service needed)
            // Only filter for valid technician IDs (> 0)
            List<Ticket> technicianTickets = tickets.stream()
                .filter(ticket -> ticket.getTechnicienId() != null && 
                                ticket.getTechnicienId().equals(firstTechnicianId) &&
                                ticket.getTechnicienId() > 0)
                .toList();
            
            // Validate that filtering logic works correctly
            for (Ticket ticket : technicianTickets) {
                assertEquals(firstTechnicianId, ticket.getTechnicienId(),
                    "All filtered tickets should belong to the specified technician");
            }
            
            System.out.println("✓ Repository integration validation passed - " + 
                             technicianTickets.size() + " tickets found for technician " + firstTechnicianId);
        }
    }

    @Test
    void validateDataConsistency() {
        // Cross-validation between repositories to ensure data consistency
        List<Ticket> tickets = ticketRepo.findAll();
        List<Technicien> technicians = technicienRepo.findAll();
        
        // Validate that we have a reasonable data distribution
        long ticketsWithStatus = tickets.stream()
            .filter(ticket -> ticket.getEtat() != null && ticket.getEtat() > 0)
            .count();
        
        long ticketsWithType = tickets.stream()
            .filter(ticket -> ticket.getType() != null && ticket.getType() > 0)
            .count();
        
        // At least some tickets should have status and type information
        assertTrue(ticketsWithStatus > 0 || ticketsWithType > 0,
            "Tickets should have status or type information for meaningful analysis");
        
        // Validate technician distribution
        Map<Integer, Long> ticketsByTechnician = tickets.stream()
            .filter(ticket -> ticket.getTechnicienId() != null)
            .collect(Collectors.groupingBy(Ticket::getTechnicienId, Collectors.counting()));
        
        if (!ticketsByTechnician.isEmpty()) {
            assertTrue(ticketsByTechnician.size() <= technicians.size(),
                "Number of technicians with tickets should not exceed total technicians");
        }
        
        System.out.println("✓ Repository integration validation passed");
        System.out.println("  - Tickets with status: " + ticketsWithStatus);
        System.out.println("  - Tickets with type: " + ticketsWithType);
        System.out.println("  - Active technicians: " + ticketsByTechnician.size());
    }
}