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

    // API - Tickets résolus - SQL natif
    @Query(value = """
        SELECT COUNT(i."IssueID")
        FROM "ZDEV_GP"."MARISupportIssue" i
        JOIN "ZDEV_GP"."MARISupportSettings" s
          ON i."Status" = s."ID" AND s."Setting" = 1
        WHERE LOWER(s."Matchcode") LIKE '%résolu%'
           OR LOWER(s."Matchcode") LIKE '%fermé%'
           OR LOWER(s."Matchcode") LIKE '%clos%'
        """, nativeQuery = true)
    long countTicketsResolus();

    // API - Temps de résolution moyen - SQL natif
    @Query(value = """
        SELECT COALESCE(AVG(DAYS_BETWEEN(i."RequestDate", i."USER_DateCloture") * 24.0), 0.0)
        FROM "ZDEV_GP"."MARISupportIssue" i
        WHERE i."USER_DateCloture" IS NOT NULL
          AND i."USER_DateCloture" >= i."RequestDate"
        """, nativeQuery = true)
    Double getTempsResolutionMoyen();

    // API - Evolution des tickets par jour - SQL natif
    @Query(value = """
        WITH date_range AS (
            SELECT ADD_DAYS(CURRENT_DATE, -LEVEL + 1) as date_val
            FROM DUMMY
            CONNECT BY LEVEL <= 30
        ),
        tickets_crees AS (
            SELECT 
                TO_VARCHAR(i."USER_DateReceptionEmail", 'YYYY-MM-DD') as date_creation,
                COUNT(*) as nb_crees
            FROM "ZDEV_GP"."MARISupportIssue" i
            WHERE i."USER_DateReceptionEmail" >= ADD_DAYS(CURRENT_DATE, -30)
              AND i."USER_DateReceptionEmail" IS NOT NULL
            GROUP BY TO_VARCHAR(i."USER_DateReceptionEmail", 'YYYY-MM-DD')
        ),
        tickets_resolus AS (
            SELECT 
                TO_VARCHAR(i."USER_DateCloture", 'YYYY-MM-DD') as date_resolution,
                COUNT(*) as nb_resolus
            FROM "ZDEV_GP"."MARISupportIssue" i
            WHERE i."USER_DateCloture" >= ADD_DAYS(CURRENT_DATE, -30)
              AND i."USER_DateCloture" IS NOT NULL
            GROUP BY TO_VARCHAR(i."USER_DateCloture", 'YYYY-MM-DD')
        )
        SELECT 
            TO_VARCHAR(dr.date_val, 'YYYY-MM-DD') as date,
            COALESCE(tc.nb_crees, 0) as crees,
            COALESCE(tr.nb_resolus, 0) as resolus
        FROM date_range dr
        LEFT JOIN tickets_crees tc ON TO_VARCHAR(dr.date_val, 'YYYY-MM-DD') = tc.date_creation
        LEFT JOIN tickets_resolus tr ON TO_VARCHAR(dr.date_val, 'YYYY-MM-DD') = tr.date_resolution
        ORDER BY dr.date_val ASC
        """, nativeQuery = true)
    List<Object[]> getEvolutionParJour();

}