package com.finatech.performance_service.repository;

import com.finatech.performance_service.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicienRepo extends JpaRepository<Technicien, Integer> {
}
