// TODO: Créer DTO pour nombre de tickets d'un technicien
// - Package: com.finatech.ticket_service.dto
// - Annotations: @Data, @AllArgsConstructor, @NoArgsConstructor
// - Champ: long nombreTickets
// - Javadoc simple
package com.finatech.ticket_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketsParTechnicienDTO  {
    private String Technicen  ;
    private long nombreTickets ;

}