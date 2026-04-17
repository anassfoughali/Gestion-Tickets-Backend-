package com.finatech.performance_service.repository;

import com.finatech.performance_service.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicienRepo extends JpaRepository<Technicien, Integer> {

    // Nombre de tickets pour un technicien spécifique - SQL natif
    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    WHERE i."SupportGroupID" = :technicienId
      AND i."USER_DateReceptionEmail" IS NOT NULL
    """, nativeQuery = true)
    long countTicketsByTechnicien(@Param("technicienId") int technicienId);


    // Nombre de tickets résolus pour un technicien spécifique - SQL natif
    // Compte les tickets avec statut résolu/fermé/clos ET date de clôture
    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportSettings" s
      ON i."Status" = s."ID" AND s."Setting" = 1
    WHERE i."SupportGroupID" = :technicienId
      AND i."USER_DateCloture" IS NOT NULL
      AND (LOWER(s."Matchcode") LIKE '%résolu%'
           OR LOWER(s."Matchcode") LIKE '%fermé%'
           OR LOWER(s."Matchcode") LIKE '%clos%')
    """, nativeQuery = true)
    long countTicketsResolusByTechnicien(@Param("technicienId") int technicienId);

    // Compte le nombre de techniciens distincts ayant des tickets encore actifs
    // @Query nativeQuery = true
    // COUNT(DISTINCT "SupportGroupID") dans MARISupportIssue
    // JOIN MARISupportSettings ON "Status"="ID" AND "Setting"=1
    // Exclure via LOWER() + NOT LIKE les statuts : résolu, resolu, fermé, ferme, clos, clôturé, cloture
    long countTechniciensActifs();

}
