# Plan - API Tickets Par Technicien

## Objectif
Créer endpoint GET /api/tickets/tickets-par-technicien qui retourne le nombre de tickets par technicien.

## Format réponse
```json
[
  { "technicien": "Support Niveau 1", "nombreTickets": 45 },
  { "technicien": "Support Niveau 2", "nombreTickets": 32 }
]
```

## Étapes
1. DTO avec 2 champs (technicien, nombreTickets)
2. Repository: JOIN avec MARISupportGroup, GROUP BY technicien
3. Interface service: signature méthode
4. Impl: mapping Object[] vers DTO
5. Controller: endpoint GET avec try/catch

## Validation
- Compiler: `mvn compile`
- Tester: `GET /api/tickets/tickets-par-technicien`
- Vérifier: Liste triée par nombre décroissant