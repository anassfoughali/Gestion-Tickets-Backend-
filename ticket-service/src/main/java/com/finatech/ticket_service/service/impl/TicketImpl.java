package com.finatech.ticket_service.service.impl;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.dto.TicketCompletDTO;
import com.finatech.ticket_service.dto.TicketEvolutionParJourDTO;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketInterfaceService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

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
                        ((Number ) row[0]).intValue(),
                        (String) row[1] ,
                        (String) row[2] ,
                        (String ) row[3] ,
                        (String) row[4], // Les Dates sont transformer en String avec la méthode toString()
                        row[5] != null ? row[5].toString() : null,  // date_reception
                        row[6] != null ? row[6].toString() : null,  // date_cloture
                        row[7] != null ? row[7].toString() : null
                )).toList();
    }
}