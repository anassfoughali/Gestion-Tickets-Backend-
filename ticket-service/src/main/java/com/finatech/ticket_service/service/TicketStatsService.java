package com.finatech.ticket_service.service;

/**
 * Interface pour les services de statistiques des tickets
 * Fournit des méthodes pour obtenir des métriques et comptages sur les tickets
 * 
 * @author Finatech Team
 * @version 1.0
 */
public interface TicketStatsService {
    
    /**
     * Calcule le nombre total de tickets présents dans la base de données
     * 
     * Cette méthode compte tous les tickets sans filtrage, incluant :
     * - Tickets ouverts, fermés, en cours
     * - Tous les types de priorités
     * - Tous les types d'issues
     * - Tous les statuts
     * 
     * Utilisation prévue :
     * - Affichage dans les KPI Cards du dashboard
     * - Métriques générales pour les administrateurs
     * - Charts et graphiques de synthèse
     * 
     * @return Le nombre total de tickets (Long) - jamais null
     * @throws RuntimeException si erreur d'accès à la base de données
     */
    Long getTotalTicketCount();
    
}