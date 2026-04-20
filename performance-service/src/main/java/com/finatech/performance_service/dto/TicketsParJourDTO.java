// TODO : créer un record Java avec 3 champs : date (String), nbAffectes (long), nbClotures (long)
package com.finatech.performance_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketsParJourDTO {

    private  String date ;
    private  long nbAffectes ;
    private long nbClotures ;

}
