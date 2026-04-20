package com.finatech.performance_service.service;
import org.springframework.stereotype.Service;

@Service
public interface TechnicienInterface {

    long getTechnicien(int technicienId);
    long getTicketsResolus(int technicienId);
    long getTicketsClotures(int technicienId);
    long getTicketsEncours(int technicienId) ; 
}