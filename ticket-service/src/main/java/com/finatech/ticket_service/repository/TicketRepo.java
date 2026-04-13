package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Long> {


    // API - Tickets ouverts - SQL natif
    @Query(value = """
        SELECT COUNT(i."IssueID")
        FROM "ZDEV_GP"."MARISupportIssue" i
        JOIN "ZDEV_GP"."MARISupportSettings" s
          ON i."Status" = s."ID" AND s."Setting" = 1
        WHERE LOWER(s."Matchcode") LIKE '%ouvert%'
           OR LOWER(s."Matchcode") LIKE '%nouveau%'
        """, nativeQuery = true)
    long countTicketsOuverts();

    // API - Tickets en cours - SQL natif
    @Query(value = """
        SELECT COUNT(i."IssueID")
        FROM "ZDEV_GP"."MARISupportIssue" i
        JOIN "ZDEV_GP"."MARISupportSettings" s
          ON i."Status" = s."ID" AND s."Setting" = 1
        WHERE LOWER(s."Matchcode") LIKE '%cours%'
           OR LOWER(s."Matchcode") LIKE '%attente%'
           OR LOWER(s."Matchcode") LIKE '%escalad%'
           OR LOWER(s."Matchcode") LIKE '%affect%'
        """, nativeQuery = true)
    long countTicketsEnCours();

    // API - Temps moyen par technicien - SQL natif
    @Query(value = """
        SELECT
            g."Description" as technicien,
            COALESCE(AVG(
                CASE WHEN i."USER_DateCloture" IS NOT NULL
                     AND i."USER_DateCloture" >= i."RequestDate"
                THEN DAYS_BETWEEN(i."RequestDate", i."USER_DateCloture") * 24.0
                END
            ), 0) as tempsMoyenHeures
        FROM "ZDEV_GP"."MARISupportIssue" i
        JOIN "ZDEV_GP"."MARISupportGroup" g
          ON i."SupportGroupID" = g."GroupId"
        GROUP BY g."Description"
        ORDER BY tempsMoyenHeures ASC
        """, nativeQuery = true)
    List<Object[]> getTempsResolutionParTechnicien();
}