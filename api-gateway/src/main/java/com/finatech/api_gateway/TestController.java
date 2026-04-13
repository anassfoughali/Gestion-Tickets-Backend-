package com.finatech.api_gateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/gateway")
public class TestController {

    @GetMapping("/test")
    public Mono<String> afficher() {
        return Mono.just("Je suis Un API Gateway avec une bonne état");
    }
}