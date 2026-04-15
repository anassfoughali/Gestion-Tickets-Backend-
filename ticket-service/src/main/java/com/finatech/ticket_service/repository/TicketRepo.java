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

    // API - Evolution des tickets par jour - SQL natif (colonnes String)
    @Query(value = """
        SELECT 
            COALESCE(tc.date_creation, tr.date_resolution) as date,
            COALESCE(tc.nb_crees, 0) as crees,
            COALESCE(tr.nb_resolus, 0) as resolus
        FROM (
            SELECT 
                SUBSTRING(i."USER_DateReceptionEmail", 1, 10) as date_creation,
                COUNT(*) as nb_crees
            FROM "ZDEV_GP"."MARISupportIssue" i
            WHERE i."USER_DateReceptionEmail" IS NOT NULL
              AND LENGTH(i."USER_DateReceptionEmail") >= 10
              AND SUBSTRING(i."USER_DateReceptionEmail", 1, 10) >= TO_VARCHAR(ADD_DAYS(CURRENT_DATE, -30), 'YYYY-MM-DD')
            GROUP BY SUBSTRING(i."USER_DateReceptionEmail", 1, 10)
        ) tc
        FULL OUTER JOIN (
            SELECT 
                SUBSTRING(i."USER_DateCloture", 1, 10) as date_resolution,
                COUNT(*) as nb_resolus
            FROM "ZDEV_GP"."MARISupportIssue" i
            WHERE i."USER_DateCloture" IS NOT NULL
              AND LENGTH(i."USER_DateCloture") >= 10
              AND SUBSTRING(i."USER_DateCloture", 1, 10) >= TO_VARCHAR(ADD_DAYS(CURRENT_DATE, -30), 'YYYY-MM-DD')
            GROUP BY SUBSTRING(i."USER_DateCloture", 1, 10)
        ) tr ON tc.date_creation = tr.date_resolution
        ORDER BY COALESCE(tc.date_creation, tr.date_resolution) ASC
        """, nativeQuery = true)
    List<Object[]> getEvolutionParJour();


    @Query(value = """
        SELECT 
            t."IssueID" AS IssueId,
            t."BriefDescription" AS object,
            g."Description" AS Description,
            
            s_status."Description" AS Status,
            s_priority."Description" AS Priorite,
            
            t."USER_DateReceptionEmail" AS date_reception,
            t."USER_DateCloture" AS date_cloture,
            
            CASE 
                WHEN t."USER_DateCloture" IS NOT NULL AND t."USER_DateReceptionEmail" IS NOT NULL
                THEN DAYS_BETWEEN(TO_DATE(t."USER_DateReceptionEmail", 'DD/MM/YYYY HH24:MI'), t."USER_DateCloture")
                ELSE NULL
            END AS duree_resolution

        FROM "ZDEV_GP"."MARISupportIssue" t

        LEFT JOIN "ZDEV_GP"."MARISupportGroup" g 
            ON t."SupportGroupID" = g."GroupId"

        LEFT JOIN "ZDEV_GP"."MARISupportSettings" s_status
            ON s_status."ID" = t."Status"
            AND s_status."Setting" = 1

        LEFT JOIN "ZDEV_GP"."MARISupportSettings" s_priority
            ON s_priority."ID" = t."Priority"
            AND s_priority."Setting" = 3
        """, nativeQuery = true)
    List<Object[]> getTicketsComplets();

}