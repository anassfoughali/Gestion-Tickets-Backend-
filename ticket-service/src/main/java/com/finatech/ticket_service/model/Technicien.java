package com.finatech.ticket_service.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Immutable
@Table(name = "\"MARISupportGroup\"" , schema = "\"ZDEV_GP\"")
public class Technicien {
    @Id
    @Column(name = "\"GroupId\"")
    private int Id  ;
    @Column(name = "\"Description\"")
    private  String Description ;

}
