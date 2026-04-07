package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TechnicienRepo extends JpaRepository<Technicien,Long> {
}
