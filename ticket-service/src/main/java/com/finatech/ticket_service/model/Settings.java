package com.finatech.ticket_service.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Immutable
@Table(name = "\"MARISupportSettings\"" , schema = "\"ZDEV_GP\"")
public class Settings {
    @Id
    @Column(name = "\"ID\"")
    private int id ;
    @Column(name = "\"Setting\"")
    private int settings  ;
    @Column(name="\"Description\"")
    private String description;
    // test 1651351651
    // zahyaaa

}
