package com.finatech.performance_service.repository;

import com.finatech.performance_service.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Integer> {

    // SQL Native : méthode qui permet de récupérer la liste des ticket cloturé par techncienID
    @Query(value = """
    SELECT i.*
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportSettings" s
      ON i."Status" = s."ID" AND s."Setting" = 1
    WHERE i."SupportGroupID" = :technicienId
      AND i."USER_DateCloture" IS NOT NULL
      AND i."USER_DateReceptionEmail" IS NOT NULL
      AND (
        LOWER(s."Matchcode") LIKE '%fermé%'
        OR LOWER(s."Matchcode") LIKE '%ferme%'
        OR LOWER(s."Matchcode") LIKE '%clôturé%'
        OR LOWER(s."Matchcode") LIKE '%cloture%'
        OR LOWER(s."Matchcode") LIKE '%clos%'
      )
    """, nativeQuery = true)
    List<Ticket> findAllCloturesByTechnicien(@Param("technicienId") int technicienId);

}
