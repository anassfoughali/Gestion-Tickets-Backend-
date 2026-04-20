package com.finatech.performance_service.service;

import com.finatech.performance_service.dto.TicketsParJourDTO;
import com.finatech.performance_service.model.Ticket;
import com.finatech.performance_service.repository.TechnicienRepo;
import com.finatech.performance_service.repository.TicketRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TechnicienImpl implements TechnicienInterface {

    final TechnicienRepo technicienRepo;
    final TicketRepo ticketRepo;

    public TechnicienImpl(TechnicienRepo technicienRepo, TicketRepo ticketRepo) {
        this.technicienRepo = technicienRepo;
        this.ticketRepo = ticketRepo;
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
    public long getTicketsEncours(int technicienId) {
        return technicienRepo.countTicketsEnCoursEtAttente(technicienId);
    }

    @Override
    public Double getTempsResolutionMoyen(int technienId) {
        List<Ticket> ticketList = ticketRepo.findAllCloturesByTechnicien(technienId);
        if (ticketList.isEmpty()) {
            return 0.0;
        }
        DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSSSS");
        DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return ticketList.stream()
                .mapToLong(tickett -> {
                    LocalDateTime reception = parseDate(tickett.getDate_reception(), formatter1, formatter2, formatter3);
                    LocalDateTime cloture   = parseDate(tickett.getDate_cloture(), formatter1, formatter2, formatter3);
                    return ChronoUnit.HOURS.between(reception, cloture);
                })
                .average()
                .orElse(0.0);
    }

    @Override
    public List<TicketsParJourDTO> getEvolutionParJour(int technicienId) {


        List<Object[]> affectes = technicienRepo.ticketTechnicienparjour(technicienId);

   
        List<Object[]> clotures = technicienRepo.getEvolutionTechnicen(technicienId);


        Map<String, Long> affectesParDate = new LinkedHashMap<>();
        for (Object[] row : affectes) {
            String date = (String) row[0];
            long count = ((Number) row[1]).longValue();
            affectesParDate.put(date, count);
        }

  
        Map<String, Long> cloturesParDate = new LinkedHashMap<>();
        for (Object[] row : clotures) {
            String date = (String) row[0];
            long count = ((Number) row[1]).longValue();
            cloturesParDate.put(date, count);
        }

   
        Set<String> toutesLesDates = new TreeSet<>();
        toutesLesDates.addAll(affectesParDate.keySet());
        toutesLesDates.addAll(cloturesParDate.keySet());

        return toutesLesDates.stream()
                .map(date -> new TicketsParJourDTO(
                        date,
                        affectesParDate.getOrDefault(date, 0L),
                        cloturesParDate.getOrDefault(date, 0L)
                ))
                .collect(Collectors.toList());
    }

    private LocalDateTime parseDate(String date, DateTimeFormatter... formatters) {
        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDateTime.parse(date, formatter);
            } catch (Exception ignored) {}
        }
        throw new IllegalArgumentException("Format de date non reconnu : " + date);
    }


}
