package com.finatech.ticket_service.service.impl;
import com.finatech.ticket_service.dto.*;
import com.finatech.ticket_service.repository.ProductRepo;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketInterfaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@Service
public class TicketImpl  implements TicketInterfaceService {

    final TicketRepo ticketRepo;

    final ProductRepo productRepo ; 

    public TicketImpl(
            TicketRepo ticketRepo , 
            ProductRepo productRepo
    ){
        this.ticketRepo=ticketRepo;
        this.productRepo=productRepo;
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
    @Override
    public TicketEvolutionFilteredDTO getTicketEvolutionFiltered(
            LocalDate dateDebut,
            LocalDate dateFin,
            String priorite) {

        try {

            if (dateDebut == null) {
                log.error("dateDebut ne peut pas être null");
                throw new IllegalArgumentException("dateDebut invalide");
            }
            if (dateFin == null) {
                log.error("dateFin ne peut pas être null");
                throw new IllegalArgumentException("dateFin invalide");
            }
            if (dateFin.isBefore(dateDebut)) {
                log.error("dateFin doit être >= dateDebut");
                throw new IllegalArgumentException("dateFin doit être >= dateDebut");
            }
            log.info("Récupération des tickets filtrés - dateDebut: {}, dateFin: {}, priorite: {}",
                    dateDebut, dateFin, priorite);
            LocalDateTime start = dateDebut.atStartOfDay();
            LocalDateTime end = dateFin.atTime(23, 59, 59);
            // Récupération des totaux pour la période
            Long nombreTicketArrives =
                    ticketRepo.coutTicketsArrivesParIntervalleEtPriorite(start, end, priorite);
            // Récupération des données par jour (seulement les jours avec des données)
            List<Object[]> ticketsArrivesParJour = ticketRepo.getTicketsArrivesParJourEtPriorite(start, end, priorite);
            // Création d'une map pour faciliter la fusion des données
            Map<String, TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> evolutionMap = new HashMap<>();
            // Génération de tous les jours dans l'intervalle avec des valeurs par défaut à 0
            LocalDate currentDate = dateDebut;
            while (!currentDate.isAfter(dateFin)) {
                String dateStr = currentDate.toString(); // Format YYYY-MM-DD
                evolutionMap.put(dateStr, TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO.builder()
                        .date(dateStr)
                        .ticketsArrivés(0L)
                        .build());
                currentDate = currentDate.plusDays(1);
            }
            // Traitement des tickets arrivés (mise à jour des valeurs existantes)
            for (Object[] row : ticketsArrivesParJour) {
                String date = (String) row[0];
                Long arrives = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                
                TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO existing = evolutionMap.get(date);
                if (existing != null) {
                    existing.setTicketsArrivés(arrives);
                }
            }
            // Conversion en liste triée par date
            List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> evolutionParJour = 
                evolutionMap.values().stream()
                    .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                    .collect(Collectors.toList());

            TicketEvolutionFilteredDTO dto = TicketEvolutionFilteredDTO.builder()
                    .nombreTicketsArrivés(nombreTicketArrives)
                    .date_debut(dateDebut)
                    .date_fin(dateFin)
                    .priorite(priorite)
                    .evolutionParJour(evolutionParJour)
                    .build();
            
            log.info("Résultat - Arrivés: {}, Clôturés: {}, Jours: {}",
                    nombreTicketArrives, evolutionParJour.size());
            return dto;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des tickets filtrés", e);
            throw new RuntimeException("Erreur lors du traitement des tickets filtrés", e);
        }
    }

    @Override
    public List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> getTicketEvolutionFilteredSimple(
            LocalDate dateDebut,
            LocalDate dateFin,
            String priorite) {

        try {
            if (dateDebut == null) {
                log.error("dateDebut ne peut pas être null");
                throw new IllegalArgumentException("dateDebut invalide");
            }
            if (dateFin == null) {
                log.error("dateFin ne peut pas être null");
                throw new IllegalArgumentException("dateFin invalide");
            }
            if (dateFin.isBefore(dateDebut)) {
                log.error("dateFin doit être >= dateDebut");
                throw new IllegalArgumentException("dateFin doit être >= dateDebut");
            }
            
            log.info("Récupération des tickets filtrés (simple) - dateDebut: {}, dateFin: {}, priorite: {}",
                    dateDebut, dateFin, priorite);
            
            LocalDateTime start = dateDebut.atStartOfDay();
            LocalDateTime end = dateFin.atTime(23, 59, 59);
            
            // Récupération des données par jour (seulement les jours avec des données)
            List<Object[]> ticketsArrivesParJour = ticketRepo.getTicketsArrivesParJourEtPriorite(start, end, priorite);
            
            // Création d'une map pour faciliter la fusion des données
            Map<String, TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> evolutionMap = new HashMap<>();
            
            // Génération de tous les jours dans l'intervalle avec des valeurs par défaut à 0
            LocalDate currentDate = dateDebut;
            while (!currentDate.isAfter(dateFin)) {
                String dateStr = currentDate.toString(); // Format YYYY-MM-DD
                evolutionMap.put(dateStr, TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO.builder()
                        .date(dateStr)
                        .ticketsArrivés(0L)
                        .build());
                currentDate = currentDate.plusDays(1);
            }
            
            // Traitement des tickets arrivés (mise à jour des valeurs existantes)
            for (Object[] row : ticketsArrivesParJour) {
                String date = (String) row[0];
                Long arrives = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                
                TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO existing = evolutionMap.get(date);
                if (existing != null) {
                    existing.setTicketsArrivés(arrives);
                }
            }
            // Conversion en liste triée par date
            List<TicketEvolutionFilteredDTO.TicketEvolutionParJourDTO> evolutionParJour = 
                evolutionMap.values().stream()
                    .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                    .collect(Collectors.toList());
            
            log.info("Résultat simple - Jours: {}", evolutionParJour.size());
            return evolutionParJour;
            
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des tickets filtrés (simple)", e);
            throw new RuntimeException("Erreur lors du traitement des tickets filtrés", e);
        }
    }

    @Override
    public List<ProductChangementDTO> getProduitsAvecNombreChangements() {
        try {
            List<Object[]> results = productRepo.getProduitsAvecNombreChangements();
            return results.stream()
               .map(row -> new ProductChangementDTO(
                       ((Number) row[0]).intValue(),                          // row[0] → productId
                       (String) row[1],                                        // row[1] → productName
                       row[2] != null ? (String) row[2] : null,               // row[2] → briefDescription
                       row[3] != null ? ((Number) row[3]).longValue() : 0L    // row[3] → nombreChangements
               ))
               .collect(Collectors.toList());
        }
        catch (Exception e) {
            log.error("Erreur getProduitsAvecNombreChangements", e);
            throw new RuntimeException("Erreur lors de la récupération des produits avec le nombre de changements", e);
        }
    }

    @Override
    public List<ProductClientDTO> getIssuesWithProductAndClient() {
        try {
            List<Object[]> ProduitClient = productRepo.getIssuesWithProductAndClient();
            return ProduitClient.stream()
                    .map(r -> new ProductClientDTO(
                            ((Number) r[0]).intValue(), // r[0] ->  IssueId
                            ((Number) r[1]).intValue(), // r[1] -> ProductId
                            (String) r[2],              // r[2] -> ProductName
                            r[3] != null ? (String) r[3] : null,      // r[3] -> BriefDescription
                            (String) r[4]               //  r[4] -> Client
                    ))
                    .toList();
        }catch (Exception e ) {
            log.error("Erreur getIssuesWithProductAndClient  " , e );
            throw  new RuntimeException("Erreur lors de la récupération des produits avec le client associé ");
        }

    }

    @Override
    public List<ProductChangementDTO> getTop3ProduitsZeroChangement() {
        try{
            List<Object[]> produitList = productRepo.getTop3ProduitsZeroChangement();
            return produitList.stream()
                    .map(p-> new ProductChangementDTO(
                            ((Number)p[0]).intValue(),
                            (String) p[1],
                            p[2] != null ? (String) p[2] : null,
                            p[3] != null ? ((Number) p[3]).longValue() : 0L
                            )).collect(Collectors.toList());
        } catch (Exception e ){
            log.error("Erreur getTop3ProduitsZeroChangement" , e );
            throw new RuntimeException("Erreur lors de la récupération de Top 3 produit avec 0 nombre de changement  ");
        }

    }


}



