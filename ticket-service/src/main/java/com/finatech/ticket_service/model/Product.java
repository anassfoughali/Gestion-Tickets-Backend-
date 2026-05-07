package com.finatech.ticket_service.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "\"MARISupportProduct\"", schema = "\"ZDEV_GP\"")
public class Product {
    @Id
    @Column(name = "\"ProductID\"")
    private int productId;
    @Column(name = "\"ProductName\"")
    private String product;
    @Column(name="\"BriefDescription\"")
    private String BriefDescription ; 

}