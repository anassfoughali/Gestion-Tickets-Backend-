package com.finatech.ticket_service.service;
import com.finatech.ticket_service.dto.TempsResolutionDTO;
import com.finatech.ticket_service.dto.TicketsOuvertsParTechnicienDTO;
import com.finatech.ticket_service.dto.TicketsEnCoursDTO;
import com.finatech.ticket_service.dto.TicketsOuvertsDTO;
import com.finatech.ticket_service.dto.TicketsResolusDTO;
import com.finatech.ticket_service.dto.TicketsClouresDTO;
import com.finatech.ticket_service.repository.TicketRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepo ticketRepo;

    //  API  — Tickets ouverts — SQL natif
    public TicketsOuvertsDTO getTicketsOuverts() {
        return new TicketsOuvertsDTO(ticketRepo.countTicketsOuverts());
    }
    //  API  — Tickets en cours — SQL natif
    public TicketsEnCoursDTO getTicketsEnCours() {
        return new TicketsEnCoursDTO(ticketRepo.countTicketsEnCours());
    }

    //  API  — Temps moyen par technicien — SQL natif
    public List<TempsResolutionDTO> getTempsResolutionParTechnicien() {
        return ticketRepo.getTempsResolutionParTechnicien()
                .stream()
                .map(row -> new TempsResolutionDTO(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).doubleValue() : 0.0
                ))
                .collect(Collectors.toList());
    }

    // Total tickets — JPA
    public long getTotalTickets() {
        return ticketRepo.count();
    }

    //  API  — Tickets résolus (basé sur date de clôture) — SQL natif
    public TicketsResolusDTO getTicketsResolus() {
        return new TicketsResolusDTO(ticketRepo.countTicketsResolus());
    }

    //  API  — Tickets clôturés — SQL natif
    public TicketsClouresDTO getTicketsClotures() {
        return new TicketsClouresDTO(ticketRepo.countTicketsClotures());
    }

    // API — Tickets ouverts par technicien — SQL natif
    public List<TicketsOuvertsParTechnicienDTO> getTicketsOuvertsParTechnicien() {
        return ticketRepo.countTicketsOuvertsParTechnicien()
                .stream()
                .map(row -> new TicketsOuvertsParTechnicienDTO(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).longValue() : 0L
                ))
                .collect(Collectors.toList());
    }
}