package com.finatech.ticket_service.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
@Builder
public class TicketEvolutionFilteredDTO {

    private Long nombreTicketsArrivés ;
    private Long nombreTicketsClotures ;
    private LocalDate date_debut ;
    private LocalDate date_fin ;
    private String priorite ;



}

