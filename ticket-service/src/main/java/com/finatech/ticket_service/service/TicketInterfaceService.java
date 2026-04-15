package com.finatech.ticket_service.service;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;

import java.util.List;

public interface TicketInterfaceService  {
 
 long Totale() ;
 TempsResolutionMoyenDTO TempsResolutionMoyen() ;
 List<TicketEvolutionParJourDTO> getEvolutionParJour();

}
// TODO: Ajouter signature méthode
// - Import: TicketEvolutionParJourDTO et List
// - Méthode: List<TicketEvolutionParJourDTO> getEvolutionParJour()
// - Javadoc simple