# Plan - API Tickets Par Technicien

## Objectif
Créer endpoint GET /api/tickets/technicien/{technicienId}/tickets qui retourne le nombre de tickets pour un technicien spécifique.

## Format réponse
```json
{ "nombreTickets": 45 }
```

## Exemple d'utilisation
```
GET /api/tickets/technicien/5/tickets
→ { "nombreTickets": 45 }
```

## Étapes
1. DTO avec 1 champ (nombreTickets)
2. Repository: COUNT avec WHERE SupportGroupID = :technicienId
3. Interface service: signature avec paramètre technicienId
4. Impl: appel direct au repo
5. Controller: endpoint GET avec @PathVariable

## Validation
- Compiler: `mvn compile`
- Tester: `GET /api/tickets/technicien/1/tickets`
- Vérifier: Retourne le nombre correct