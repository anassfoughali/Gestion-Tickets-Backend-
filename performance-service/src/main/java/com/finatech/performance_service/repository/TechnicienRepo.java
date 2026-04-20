package com.finatech.performance_service.repository;
import com.finatech.performance_service.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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


    // TODO : query native, grouper par jour sur USER_DateReceptionEmail pour un technicienId
    // Extraire la date avec TO_DATE + SUBSTR depuis le format 'DD/MM/YYYY HH:mm'
    // Retourner date (YYYY-MM-DD) + COUNT(IssueID) → List<Object[]>
    //tickets affectés par jour

    @Query(value = """
SELECT
    TO_VARCHAR(TO_DATE(SUBSTR("USER_DateReceptionEmail", 1, 10), 'DD/MM/YYYY'), 'YYYY-MM-DD') AS date,
    COUNT("IssueID") AS nbAffectes
FROM "ZDEV_GP"."MARISupportIssue"
WHERE "SupportGroupID" = :technicienId
  AND "USER_DateReceptionEmail" IS NOT NULL
GROUP BY TO_VARCHAR(TO_DATE(SUBSTR("USER_DateReceptionEmail", 1, 10), 'DD/MM/YYYY'), 'YYYY-MM-DD')
ORDER BY 1 ASC

""",nativeQuery = true
    )
    List<Object[]> ticketTechnicienparjour(@Param("technicienId") int technicienId);


    @Query(value = """
SELECT
    TO_VARCHAR("USER_DateCloture", 'YYYY-MM-DD') AS date,
    COUNT(i."IssueID") AS nbClotures
FROM "ZDEV_GP"."MARISupportIssue" i
JOIN "ZDEV_GP"."MARISupportSettings" s
    ON i."Status" = s."ID"
    AND s."Setting" = 1
WHERE i."SupportGroupID" = :technicienId
  AND i."USER_DateCloture" IS NOT NULL
  AND (
    LOWER(s."Matchcode") LIKE '%fermé%'
    OR LOWER(s."Matchcode") LIKE '%ferme%'
    OR LOWER(s."Matchcode") LIKE '%clôturé%'
    OR LOWER(s."Matchcode") LIKE '%cloture%'
    OR LOWER(s."Matchcode") LIKE '%clos%'
  )
GROUP BY TO_VARCHAR("USER_DateCloture", 'YYYY-MM-DD')
ORDER BY 1 ASC
""", nativeQuery = true)
    List<Object[]> getEvolutionTechnicen(@Param("technicienId") int technicienId);


}
