package com.finatech.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketEvolutionFilteredDTO {
    
    private Long nombreTicketsArrivés;
    private Long nombreTicketsClotures;
    private LocalDate date_debut;
    private LocalDate date_fin;
    private String priorite;
    private List<TicketEvolutionParJourDTO> evolutionParJour;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class TicketEvolutionParJourDTO {
        private String date;
        private Long ticketsArrivés;
    }
}
