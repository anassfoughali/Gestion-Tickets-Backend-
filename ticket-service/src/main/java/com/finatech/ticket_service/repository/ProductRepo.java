package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Product;
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


}
