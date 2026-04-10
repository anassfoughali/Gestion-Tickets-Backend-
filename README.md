# DashboardKPI Tickets — Microservices Architecture

Spring Boot / Spring Cloud microservices platform for KPI ticket management.

## Services

| Service | Port | Description |
|---|---|---|
| `discovery-service` | 8761 | Eureka service registry |
| `config-server` | 8888 | Centralized Spring Cloud Config Server |
| `api-gateway` | 8080 | API Gateway — single entry point |
| `auth-service` | 8081 | Authentication and authorization |
| `ticket-service` | 8082 | Ticket management |
| `performance-service` | 8083 | Performance KPIs (SAP HANA) |

## Tech Stack

- Java 17
- Spring Boot 3.x
- Spring Cloud (Eureka, Config, Gateway)
- SAP HANA (performance-service)
- Lombok, Spring Data JPA

## Startup Order

1. discovery-service (Eureka)
2. config-server
3. auth-service, ticket-service, performance-service
4. api-gateway

## Build

`ash
# From each service directory
./mvnw clean package -DskipTests
`
