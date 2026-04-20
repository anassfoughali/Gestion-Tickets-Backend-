package com.finatech.performance_service.controller;
import com.finatech.performance_service.service.TechnicienImpl;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{technicienId}/resolus")
    public long getTicketResolue(@PathVariable int technicienId) {
        return service.getTicketsResolus(technicienId);
    }
    @GetMapping("/{technicienId}/clotures")
    public long getTicketsClotures(@PathVariable int technicienId)
    {
        return service.getTicketsClotures(technicienId);
    }

    @GetMapping("/{technicienId}/en_cours")
    public long getTicketsEnCours(@PathVariable int technicienId){
        return service.getTicketsEncours(technicienId);
    }

    @GetMapping("/{technicienId}/temps-resolution-moyen")
    public ResponseEntity<Double> getTicketAverageClotures(@PathVariable int technicienId) {
        return ResponseEntity.ok(service.getTempsResolutionMoyen(technicienId));

    }

}