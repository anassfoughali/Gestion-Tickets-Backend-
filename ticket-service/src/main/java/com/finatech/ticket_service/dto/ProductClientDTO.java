package com.finatech.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductClientDTO {

    private int IssueId ;
    private  int productId ;
    private String productName ;
    private String briefDescription ;
    private String client ;
}
