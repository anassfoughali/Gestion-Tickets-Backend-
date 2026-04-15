package com.finatech.ticket_service.service.impl;
import com.finatech.ticket_service.dto.TempsResolutionMoyenDTO;
import com.finatech.ticket_service.repository.TicketRepo;
import com.finatech.ticket_service.service.TicketInterfaceService;
import org.springframework.stereotype.Service;

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
}
// TODO: Implémenter getEvolutionParJour()
// - Appeler ticketRepo.getEvolutionParJour()
// - Mapper Object[] vers DTO avec stream().map()
// - Gérer null: row[1] != null ? ((Number) row[1]).longValue() : 0
// - Retourner collect(Collectors.toList())