package com.finatech.performance_service.repository;

import com.finatech.performance_service.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicienRepo extends JpaRepository<Technicien, Integer> {

    // Acces donnée Nombre de tickets pour un technicien spécifique - SQL natif
    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    WHERE i."SupportGroupID" = :technicienId
    """, nativeQuery = true)
    long countTicketsByTechnicien(@Param("technicienId") int technicienId);

}
