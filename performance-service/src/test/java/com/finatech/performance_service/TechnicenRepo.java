package com.finatech.performance_service;

import com.finatech.performance_service.repository.TechnicienRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TechnicenRepo  {

    @Autowired
    private TechnicienRepo  technicienRepo;

    @Test
    public void testConnectionJPA(){
        technicienRepo.findAll() ;
    }
}
