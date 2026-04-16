package com.finatech.performance_service.service;
import com.finatech.performance_service.repository.TechnicienRepo;
import org.springframework.stereotype.Service;

@Service
public class TechnicienImpl implements TechnicienInterface{

    final TechnicienRepo technicienRepo ;

    public TechnicienImpl(TechnicienRepo technicienRepo ){
        this.technicienRepo = technicienRepo ;
    }
    @Override
    public long getTechnicien(int technicienId) {
        return technicienRepo.countTicketsByTechnicien(technicienId);
    }
    @Override
    public long getTicketsResolus(int technicienId) {
        return technicienRepo.countTicketsResolusByTechnicien(technicienId);
    }
}
