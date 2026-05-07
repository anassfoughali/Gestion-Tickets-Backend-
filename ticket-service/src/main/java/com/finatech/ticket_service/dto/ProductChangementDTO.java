package com.finatech.ticket_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductChangementDTO {
    private  int productId ;
    private String productName ;
    private  String briefdescription ;
    private  long nombredechangement ;



}

