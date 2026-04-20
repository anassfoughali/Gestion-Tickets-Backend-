package com.finatech.performance_service.service;

import com.finatech.performance_service.dto.TicketsParJourDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TechnicienInterface {

    long getTechnicien(int technicienId);
    long getTicketsResolus(int technicienId);
    long getTicketsClotures(int technicienId);
    long getTicketsEncours(int technicienId);
    Double getTempsResolutionMoyen(int technienId);
    List<TicketsParJourDTO> getEvolutionParJour(int technicienId);
}
