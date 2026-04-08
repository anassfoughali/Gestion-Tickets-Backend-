package com.finatech.ticket_service;
import com.finatech.ticket_service.repository.TechnicienRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
@SpringBootTest
public class TechnicienRepoTest {

    @Autowired
    TechnicienRepo repo ;

    @Test
    public void testConnectionJPA(){
        repo.findAll() ;
    }


}
