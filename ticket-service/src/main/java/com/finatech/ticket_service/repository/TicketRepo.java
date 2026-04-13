package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour les opérations sur les tickets
 * Hérite automatiquement de la méthode count() de JpaRepository
 */
@Repository
public interface TicketRepo extends JpaRepository<Ticket, Long> {
    
    /**
     * Compte le nombre total de tickets dans la base de données
     * Méthode héritée automatiquement de JpaRepository<Ticket, Long>
     * Génère automatiquement : SELECT COUNT(*) FROM "ZDEV_GP"."MARISupportIssue"
     * 
     * @return Le nombre total de tickets
     */
    // count() est automatiquement disponible via JpaRepository
    
}