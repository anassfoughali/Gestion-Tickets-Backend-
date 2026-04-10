package com.finatech.ticket_service;
import com.finatech.ticket_service.repository.TicketRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

// Test Intégration pour tester la communication Sprint JPA -> SAP HANA DB
@SpringBootTest
public class TicketRepositoryTest {

    @Autowired
    private TicketRepo repo ;

    @Test
    void testConnectionAndRead(){
        repo.findAll();
    }


}
