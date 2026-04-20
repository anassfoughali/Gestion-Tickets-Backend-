package com.finatech.performance_service.service;
import org.springframework.stereotype.Service;

@Service
public interface TechnicienInterface {

    long getTechnicien(int technicienId);
    long getTicketsResolus(int technicienId);
    long getTicketsClotures(int technicienId);
    long getTicketsEncours(int technicienId) ;
    Double getTempsResolutionMoyen(int technienId);

    // Déclarer la méthode : getTempsResolutionMoyen(int technicienId)
    // Retourne : Double — le temps moyen de résolution en heures pour ce technicien
}