package com.finatech.performance_service.service;
import org.springframework.stereotype.Service;

@Service
public interface TechnicienInterface {

    long getTechnicien(int technicienId);
    long getTicketsResolus(int technicienId);

    // Retourne le nombre de techniciens ayant au moins un ticket ouvert (non résolu/fermé/clos)
    long getTechniciensActifs();
}