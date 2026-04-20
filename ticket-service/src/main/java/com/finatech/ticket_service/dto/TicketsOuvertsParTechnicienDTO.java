package com.finatech.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketsOuvertsParTechnicienDTO {
    private String technicien;
    private long nombreTicketsOuverts;
}
