# Validation Steps

## Après implémentation:
1. Compiler: `mvn compile`
2. Tester SQL sur HANA directement
3. Démarrer app: `mvn spring-boot:run`
4. Tester endpoint: `GET /api/tickets/stats-par-jour`
5. Vérifier format JSON: `[{"date":"2026-03-16","crees":5,"resolus":3}]`

## Critères succès:
- ✅ Compilation OK
- ✅ HTTP 200 + données JSON
- ✅ Dates sur 30 jours
- ✅ Compteurs cohérents