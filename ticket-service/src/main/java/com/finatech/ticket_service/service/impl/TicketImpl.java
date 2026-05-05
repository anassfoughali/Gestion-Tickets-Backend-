package com.finatech.ticket_service.service.impl;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketCompletDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;
import com.finatech.ticket_service.dto.TopTechnicienDTO;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketInterfaceService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

// TODO: Ajouter les imports nécessaires pour la nouvelle fonctionnalité
// import com.finatech.ticket_service.dto.TicketEvolutionFilteredDTO;
// import java.time.LocalDate;
// import lombok.extern.slf4j.Slf4j;

// TODO: Ajouter l'annotation @Slf4j pour le logging
@Service
public class TicketImpl  implements TicketInterfaceService {

    final TicketRepo ticketRepo;

    //Dependency Injection by constructor
    public TicketImpl(
            TicketRepo ticketRepo
    ){
        this.ticketRepo=ticketRepo ;
    }

    @Override
    public long Totale() {
        return ticketRepo.count();
    }

    @Override
    public TempsResolutionMoyenDTO TempsResolutionMoyen(){
       Double temps = ticketRepo.getTempsResolutionMoyen();
       if(temps == null) {
           return new TempsResolutionMoyenDTO(0.0);
       }
       return new TempsResolutionMoyenDTO(temps);
    }

    @Override
    public List<TicketEvolutionParJourDTO> getEvolutionParJour() {
        // Appel du repository
        List<Object[]> results = ticketRepo.getEvolutionParJour();
        // Mapping vers DTO
        return results.stream()
                .map(row -> new TicketEvolutionParJourDTO(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).longValue() : 0L,
                        row[2] != null ? ((Number) row[2]).longValue() : 0L

                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketCompletDTO> getTicketDetails() {
        // Appele du repository

        List<Object[]> ticketsComplets = ticketRepo.getTicketsComplets();
        // Mapping vers DTO
        return ticketsComplets.stream()
                .map(row-> new TicketCompletDTO(
                        ((Number ) row[0]).intValue(),  // IssueId
                        (String) row[1],                 // object
                        (String) row[2],                 // Description (technicien)
                        (String) row[3],                 // Status
                        (String) row[4],                 // Priorite
                        row[5] != null ? row[5].toString() : null,  // date_reception
                        row[6] != null ? row[6].toString() : null,  // date_cloture
                        row[7] != null ? row[7].toString() : null,  // duree_resolution
                        (String) row[8],                 // client
                        (String) row[9]                  // IssueType
                )).toList();
    }

    @Override
    public List<TopTechnicienDTO> getTop5TechniciensByClotures() {
        // Appel du repository
        List<Object[]> results = ticketRepo.getTop5TechniciensByClotures();
        // Mapping vers DTO
        return results.stream()
                .map(row -> new TopTechnicienDTO(
                        (String) row[0],                           // technicien
                        row[1] != null ? ((Number) row[1]).longValue() : 0L  // nombreTicketsClotures
                ))
                .collect(Collectors.toList());
    }

    // ========================================================================
    // NOUVELLE FONCTIONNALITÉ : FILTRAGE PAR INTERVALLE DE DATES ET PRIORITÉ
    // ========================================================================

    // TODO: Implémenter la méthode getTicketEvolutionFiltered
    // - Ajouter l'annotation @Override
    // - Signature : public TicketEvolutionFilteredDTO getTicketEvolutionFiltered(LocalDate dateDebut, LocalDate dateFin, String priorite)
    //
    // ÉTAPE 1 : VALIDATION DES PARAMÈTRES
    // - Vérifier que dateDebut n'est pas null
    //   * Si null, logger l'erreur avec log.error("dateDebut ne peut pas être null")
    //   * Lever une IllegalArgumentException avec un message approprié
    //
    // - Vérifier que dateFin n'est pas null
    //   * Si null, logger l'erreur avec log.error("dateFin ne peut pas être null")
    //   * Lever une IllegalArgumentException avec un message approprié
    //
    // - Vérifier que dateFin >= dateDebut
    //   * Si dateFin < dateDebut, logger l'erreur avec log.error("dateFin doit être >= dateDebut")
    //   * Lever une IllegalArgumentException avec un message approprié
    //
    // - Vérifier que priorite n'est pas null ou vide
    //   * Si null ou vide, logger l'erreur avec log.error("priorite ne peut pas être null ou vide")
    //   * Lever une IllegalArgumentException avec un message approprié
    //
    // ÉTAPE 2 : APPEL DES MÉTHODES DU REPOSITORY
    // - Logger le début du traitement avec log.info("Récupération des tickets filtrés - dateDebut: {}, dateFin: {}, priorite: {}", dateDebut, dateFin, priorite)
    //
    // - Appeler ticketRepo.countTicketsArrivesParIntervalleEtPriorite(dateDebut, dateFin, priorite)
    //   * Stocker le résultat dans une variable Long nombreTicketsArrivés
    //   * Gérer le cas où le résultat est null (mettre 0L par défaut)
    //
    // - Appeler ticketRepo.countTicketsClouresParIntervalleEtPriorite(dateDebut, dateFin, priorite)
    //   * Stocker le résultat dans une variable Long nombreTicketsClotures
    //   * Gérer le cas où le résultat est null (mettre 0L par défaut)
    //
    // ÉTAPE 3 : CONSTRUCTION DU DTO
    // - Utiliser le pattern Builder pour construire le DTO
    //   * TicketEvolutionFilteredDTO.builder()
    //   * .nombreTicketsArrivés(nombreTicketsArrivés)
    //   * .nombreTicketsClotures(nombreTicketsClotures)
    //   * .dateDebut(dateDebut)
    //   * .dateFin(dateFin)
    //   * .priorite(priorite)
    //   * .build()
    //
    // ÉTAPE 4 : LOGGING ET RETOUR
    // - Logger le résultat avec log.info("Résultat - Arrivés: {}, Clôturés: {}", nombreTicketsArrivés, nombreTicketsClotures)
    // - Retourner le DTO construit
    //
    // ÉTAPE 5 : GESTION DES EXCEPTIONS
    // - Entourer le code d'un try-catch si nécessaire
    // - Logger toute exception avec log.error("Erreur lors de la récupération des tickets filtrés", exception)
    // - Relancer l'exception ou lever une exception métier personnalisée

}

