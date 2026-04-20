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
    // Compte uniquement les tickets avec statut "résolu" (pas fermé, pas clos)
    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportSettings" s
      ON i."Status" = s."ID" AND s."Setting" = 1
    WHERE i."SupportGroupID" = :technicienId
      AND LOWER(s."Matchcode") LIKE '%résolu%'
    """, nativeQuery = true)
    long countTicketsResolusByTechnicien(@Param("technicienId") int technicienId);

    // Nombre total de tickets clôturés (fermé/clôturé/clos) pour un technicien donné
    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportSettings" s
      ON i."Status" = s."ID"
      AND s."Setting" = 1
    WHERE i."SupportGroupID" = :technicienId
      AND (
        LOWER(s."Matchcode") LIKE '%fermé%'
        OR LOWER(s."Matchcode") LIKE '%ferme%'
        OR LOWER(s."Matchcode") LIKE '%clôturé%'
        OR LOWER(s."Matchcode") LIKE '%cloture%'
        OR LOWER(s."Matchcode") LIKE '%clos%'
      )
""", nativeQuery = true)
    long countTicketsClotures(@Param("technicienId") int technicienId);

    @Query(value = """
    SELECT COUNT(i."IssueID")
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportSettings" s
      ON i."Status" = s."ID"
      AND s."Setting" = 1
    WHERE i."SupportGroupID" = :technicienId
      AND (
        LOWER(s."Matchcode") LIKE '%cours%'
        OR LOWER(s."Matchcode") LIKE '%progress%'
        OR LOWER(s."Matchcode") LIKE '%attente%'
        OR LOWER(s."Matchcode") LIKE '%pending%'
        OR LOWER(s."Matchcode") LIKE '%encours%'
      )
""", nativeQuery = true)
long countTicketsEnCoursEtAttente(@Param("technicienId") int technicienId);



}
