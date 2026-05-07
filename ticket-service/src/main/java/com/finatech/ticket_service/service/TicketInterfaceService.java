package com.finatech.ticket_service.service;
import com.finatech.ticket_service.dto.*;

import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

public interface TicketInterfaceService  {
 long Totale() ;
 TempsResolutionMoyenDTO TempsResolutionMoyen() ;
 List<TicketEvolutionParJourDTO> getEvolutionParJour();
 List<TicketCompletDTO> getTicketDetails();
 List<TopTechnicienDTO> getTop5TechniciensByClotures();
 TicketEvolutionFilteredDTO getTicketEvolutionFiltered(LocalDate dateDebut, LocalDate dateFin, String priorite);
 List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> getTicketEvolutionFilteredSimple(LocalDate dateDebut, LocalDate dateFin, String priorite);
 List<ProductChangementDTO>  getProduitsAvecNombreChangements() ;
 List<ProductClientDTO> getIssuesWithProductAndClient() ;
 List<ProductChangementDTO>  getTop3ProduitsZeroChangement();

}

