# Plan - Tickets Résolus Par Technicien

## Objectif
Créer endpoint GET /api/technicien/{technicienId}/resolus qui retourne le nombre de tickets résolus pour un technicien spécifique.

## Format réponse
```
45
```
(Un simple nombre, pas de JSON)

## Exemple d'utilisation
```
GET /api/technicien/5/resolus
→ 45
```

## Logique SQL
- Compter tickets avec USER_DateCloture IS NOT NULL
- Filtrer par SupportGroupID = technicienId
- Plus fiable que le statut

## Étapes
1. Repository: COUNT avec WHERE USER_DateCloture IS NOT NULL AND SupportGroupID = :technicienId
2. Interface service: signature avec paramètre technicienId
3. Impl: appel direct au repo
4. Controller: endpoint GET /{technicienId}/resolus

## Validation
- Compiler: `mvn compile`
- Tester: `GET /api/technicien/1/resolus`
- Via Gateway: `GET http://localhost:8080/api/technicien/1/resolus`
- Vérifier: Retourne le nombre correct de tickets résolus