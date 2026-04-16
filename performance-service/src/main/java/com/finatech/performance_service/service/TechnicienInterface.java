package com.finatech.performance_service.service;
import org.springframework.stereotype.Service;

@Service
public interface TechnicienInterface {

    long getTechnicien(int technicienId);
    long getTicketsResolus(int technicienId);
}

    // TODO: Ajouter signature méthode
    // - Méthode: long getTicketsResolus(int technicienId)
    // - Javadoc: Retourne le nombre de tickets résolus pour un technicien