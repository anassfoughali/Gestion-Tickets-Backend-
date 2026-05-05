package com.finatech.ticket_service.service;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketCompletDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;
import com.finatech.ticket_service.dto.TopTechnicienDTO;
import java.time.LocalDateTime;
import java.util.List;
import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
import java.time.LocalDate;

public interface TicketInterfaceService  {
 long Totale() ;
 TempsResolutionMoyenDTO TempsResolutionMoyen() ;
 List<TicketEvolutionParJourDTO> getEvolutionParJour();
 List<TicketCompletDTO> getTicketDetails();
 List<TopTechnicienDTO> getTop5TechniciensByClotures();
 TicketEvolutionFilteredDTO getTicketEvolutionFiltered(LocalDate dateDebut, LocalDate dateFin, String priorite);
}

