package com.finatech.performance_service.controller;
import com.finatech.performance_service.service.TechnicienImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/technicien")

public class TechnienController {

    final TechnicienImpl service ;

    public TechnienController(
            TechnicienImpl service
    )
    {
        this.service=service;
    }
    @GetMapping("/{technicienId}")
    public long getTicketsByTechnicien(@PathVariable int technicienId){
         return service.getTechnicien(technicienId);
    }

}

    // TODO: Ajouter endpoint GET /{technicienId}/resolus
    // - @GetMapping("/{technicienId}/resolus")
    // - @PathVariable int technicienId
    // - Retour: long (nombre de tickets résolus)
    // - Appeler service.getTicketsResolus(technicienId)
    // - Javadoc: Retourne le nombre de tickets résolus par un technicien