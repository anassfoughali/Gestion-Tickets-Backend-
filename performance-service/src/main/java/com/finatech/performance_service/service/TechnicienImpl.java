package com.finatech.performance_service.service;
import com.finatech.performance_service.model.Ticket;
import com.finatech.performance_service.repository.TechnicienRepo;
import com.finatech.performance_service.repository.TicketRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TechnicienImpl implements TechnicienInterface{

    final TechnicienRepo technicienRepo ;
    final TicketRepo ticketRepo ;

    // Injecter également TicketRepo via le constructeur (injection par constructeur, pas @Autowired)
    // Ajouter le champ : final TicketRepo ticketRepo

    public TechnicienImpl(TechnicienRepo technicienRepo , TicketRepo ticketRepo){
        this.technicienRepo = technicienRepo ;
        this.ticketRepo = ticketRepo ;
        // Ajouter ticketRepo dans les paramètres du constructeur et l'assigner ici
    }
    @Override
    public long getTechnicien(int technicienId) {
        return technicienRepo.countTicketsByTechnicien(technicienId);
    }
    @Override
    public long getTicketsResolus(int technicienId) {
        return technicienRepo.countTicketsResolusByTechnicien(technicienId);
    }

    @Override
    public long getTicketsClotures(int technicienId) {
        return technicienRepo.countTicketsClotures(technicienId);
    }

    @Override
    public long getTicketsEncours(int technicienId){
        return technicienRepo.countTicketsEnCoursEtAttente(technicienId);
    }

    @Override
    public Double getTempsResolutionMoyen(int technienId) {
        List<Ticket> ticketList = ticketRepo.findAllCloturesByTechnicien(technienId);
        if (ticketList.isEmpty()) {
            return 0.0;
        }
        return ticketList.stream()
                .mapToLong(tickett -> {
                    LocalDateTime reception = java.sql.Timestamp.valueOf(tickett.getDate_reception()).toLocalDateTime();
                    LocalDateTime cloture   = java.sql.Timestamp.valueOf(tickett.getDate_cloture()).toLocalDateTime();
                    return ChronoUnit.HOURS.between(reception, cloture);
                })
                .average()
                .orElse(0.0);
    }
}
