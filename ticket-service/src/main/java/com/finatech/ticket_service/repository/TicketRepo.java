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
  
}