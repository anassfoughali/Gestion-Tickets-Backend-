package com.finatech.performance_service.controller;
import com.finatech.performance_service.service.TechnicienImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technicien")

public class TechnienController {

    final TechnicienImpl service ;

    public TechnienController(
            TechnicienImpl service) {this.service=service;}

    @GetMapping("/{technicienId}")
    public long getTicketsByTechnicien(@PathVariable int technicienId){
        return service.getTechnicien(technicienId);
    }

    @GetMapping(" /{technicienId}/resolus")
    public long getTicketResolue(@PathVariable int technicienId) {
        return service.getTicketsResolus(technicienId);
    }

}