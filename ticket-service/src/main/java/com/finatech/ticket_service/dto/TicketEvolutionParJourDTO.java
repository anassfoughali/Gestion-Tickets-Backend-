package com.finatech.ticket_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketEvolutionParJourDTO {
    private String date ;
    private long nbr_crees;
    private long nbr_clotures;

}