package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Product;
import org.hibernate.query.spi.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {


@Query(value = """
SELECT p."ProductID", p."ProductName", p."BriefDescription", COUNT(i."IssueID") AS nombreChangements
FROM "ZDEV_GP"."MARISupportProduct" p
LEFT JOIN "ZDEV_GP"."MARISupportIssue" i ON p."ProductID" = i."ProductID"
GROUP BY p."ProductID", p."ProductName", p."BriefDescription"
ORDER BY nombreChangements DESC
     """ , nativeQuery=true)  
public List<Object[]> getProduitsAvecNombreChangements();

    @Query(value = """
    SELECT 
        i."IssueID",
        i."ProductID",
        p."ProductName",
        p."BriefDescription",
        i."AddressMatchcode"
    FROM "ZDEV_GP"."MARISupportIssue" i
    JOIN "ZDEV_GP"."MARISupportProduct" p
        ON i."ProductID" = p."ProductID"
    """, nativeQuery = true)
    List<Object[]> getIssuesWithProductAndClient();

    @Query(value = """
    SELECT 
         p."ProductID",
         p."ProductName",
        p."BriefDescription",
        0 
        FROM  "ZDEV_GP"."MARISUpportProduct" p 
        LEFT JOIN  "ZDEV_GP"."MARISUpportIssue" i ON  p."ProductID"=i."ProductID"
        GROUP BY p."ProductID" , p."ProductName" , p."BriefDescription"
        HAVING COUNT(i."issueID") = 0 
        LIMIT 3 
    """, nativeQuery = true)
    List<Object[]> getTop3ProduitsZeroChangement();
    /*
     * Ordre des colonnes dans Object[] : row[0]=ProductID, row[1]=ProductName, row[2]=BriefDescription, row[3]=0
     */

 }
