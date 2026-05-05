package com.finatech.ticket_service.service;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketCompletDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;
import com.finatech.ticket_service.dto.TopTechnicienDTO;
import java.util.List;

// TODO: Ajouter l'import pour le nouveau DTO
// import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;

// TODO: Ajouter l'import pour LocalDate
// import java.time.LocalDate;

public interface TicketInterfaceService  {
 long Totale() ;
 TempsResolutionMoyenDTO TempsResolutionMoyen() ;
 List<TicketEvolutionParJourDTO> getEvolutionParJour();
 List<TicketCompletDTO> getTicketDetails();
 List<TopTechnicienDTO> getTop5TechniciensByClotures();

 // ========================================================================
 // NOUVELLE FONCTIONNALITÉ : FILTRAGE PAR INTERVALLE DE DATES ET PRIORITÉ
 // ========================================================================

 // TODO: Déclarer la signature de la méthode getTicketEvolutionFiltered
 // - Nom de la méthode : getTicketEvolutionFiltered
 // - Paramètres :
 //   * LocalDate dateDebut : date de début de l'intervalle
 //   * LocalDate dateFin : date de fin de l'intervalle
 //   * String priorite : priorité à filtrer (ex: "HAUTE", "MOYENNE", "BASSE")
 // - Type de retour : TicketEvolutionFilteredDTO
 //
 // Cette méthode sera implémentée dans TicketImpl.java
 // Elle permettra de récupérer le nombre de tickets arrivés et clôturés
 // pour un intervalle de dates et une priorité donnés

}

