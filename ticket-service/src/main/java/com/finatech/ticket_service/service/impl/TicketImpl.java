package com.finatech.ticket_service.service.impl;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketCompletDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;
import com.finatech.ticket_service.dto.TopTechnicienDTO;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketInterfaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
import java.time.LocalDate;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TicketImpl  implements TicketInterfaceService {

    final TicketRepo ticketRepo;

    //Dependency Injection by constructor
    public TicketImpl(
            TicketRepo ticketRepo
    ){
        this.ticketRepo=ticketRepo ;
    }

    @Override
    public long Totale() {
        return ticketRepo.count();
    }

    @Override
    public TempsResolutionMoyenDTO TempsResolutionMoyen(){
       Double temps = ticketRepo.getTempsResolutionMoyen();
       if(temps == null) {
           return new TempsResolutionMoyenDTO(0.0);
       }
       return new TempsResolutionMoyenDTO(temps);
    }

    @Override
    public List<TicketEvolutionParJourDTO> getEvolutionParJour() {
        // Appel du repository
        List<Object[]> results = ticketRepo.getEvolutionParJour();
        // Mapping vers DTO
        return results.stream()
                .map(row -> new TicketEvolutionParJourDTO(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).longValue() : 0L,
                        row[2] != null ? ((Number) row[2]).longValue() : 0L

                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketCompletDTO> getTicketDetails() {
        // Appele du repository

        List<Object[]> ticketsComplets = ticketRepo.getTicketsComplets();
        // Mapping vers DTO
        return ticketsComplets.stream()
                .map(row-> new TicketCompletDTO(
                        ((Number ) row[0]).intValue(),  // IssueId
                        (String) row[1],                 // object
                        (String) row[2],                 // Description (technicien)
                        (String) row[3],                 // Status
                        (String) row[4],                 // Priorite
                        row[5] != null ? row[5].toString() : null,  // date_reception
                        row[6] != null ? row[6].toString() : null,  // date_cloture
                        row[7] != null ? row[7].toString() : null,  // duree_resolution
                        (String) row[8],                 // client
                        (String) row[9]                  // IssueType
                )).toList();
    }

    @Override
    public List<TopTechnicienDTO> getTop5TechniciensByClotures() {
        // Appel du repository
        List<Object[]> results = ticketRepo.getTop5TechniciensByClotures();
        // Mapping vers DTO
        return results.stream()
                .map(row -> new TopTechnicienDTO(
                        (String) row[0],                           // technicien
                        row[1] != null ? ((Number) row[1]).longValue() : 0L  // nombreTicketsClotures
                ))
                .collect(Collectors.toList());
    }
    @Override
    public TicketEvolutionFilteredDTO getTicketEvolutionFiltred(
            LocalDate dateDebut,
            LocalDate dateFin,
            String priorite) {

        try {

            if (dateDebut == null) {
                log.error("dateDebut ne peut pas être null");
                throw new IllegalArgumentException("dateDebut invalide");
            }
            if (dateFin == null) {
                log.error("dateFin ne peut pas être null");
                throw new IllegalArgumentException("dateFin invalide");
            }
            if (dateFin.isBefore(dateDebut)) {
                log.error("dateFin doit être >= dateDebut");
                throw new IllegalArgumentException("dateFin doit être >= dateDebut");
            }
            log.info("Récupération des tickets filtrés - dateDebut: {}, dateFin: {}, priorite: {}",
                    dateDebut, dateFin, priorite);
            LocalDateTime start = dateDebut.atStartOfDay();
            LocalDateTime end = dateFin.atTime(23, 59, 59);
            Long nombreTicketArrives =
                    ticketRepo.coutTicketsArrivesParIntervalleEtPriorite(start, end, priorite);
            Long nombreTicketClotures =
                    ticketRepo.countTicketsClouresParIntervalleEtPriorite(start, end, priorite);
            TicketEvolutionFilteredDTO dto = TicketEvolutionFilteredDTO.builder()
                    .nombreTicketsArrivés(nombreTicketArrives)
                    .nombreTicketsClotures(nombreTicketClotures)
                    .date_debut(dateDebut)
                    .date_fin(dateFin)
                    .priorite(priorite)
                    .build();
            log.info("Résultat - Arrivés: {}, Clôturés: {}",
                    nombreTicketArrives, nombreTicketClotures);
            return dto;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des tickets filtrés", e);
            throw new RuntimeException("Erreur lors du traitement des tickets filtrés", e);
        }
    }

    }




