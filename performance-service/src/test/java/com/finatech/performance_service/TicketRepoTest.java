package com.finatech.performance_service;
import com.finatech.performance_service.repository.TicketRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
@SpringBootTest
public class TicketRepoTest {

    @Autowired
    private TicketRepo ticketRepo ;

    @Test
    public void testConnectionJPA(){ticketRepo.findAll() ;}
}
