package com.finatech.ticket_service.service.impl;
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
        return
                ticketRepo.count();
    }
}
