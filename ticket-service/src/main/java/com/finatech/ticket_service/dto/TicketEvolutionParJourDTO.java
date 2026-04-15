// TODO: Créer DTO pour évolution quotidienne des tickets
// - Package: com.finatech.ticket_service.dto
// - Annotations: @Data, @AllArgsConstructor, @NoArgsConstructor
// - Champs: String date, long crees, long resolus
// - Javadoc simple sur la classe
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
    private long nbr_resolus;

}