package com.finatech.ticket_service;

import com.finatech.ticket_service.repository.ProductRepo;
import com.finatech.ticket_service.repository.TicketRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProductRepositoryTest {

    @Autowired
    private ProductRepo repo ;

    @Test
    void testConnectionAndRead(){
        repo.findAll();
    }
}
