package com.finatech.performance_service.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Immutable;
@Data
@Entity
@Immutable
@Table(name = "MARISupportIssue", schema = "ZDEV_GP")
public class Ticket {
    @Id
    @Column(name = "\"IssueID\"")
    private Integer Id;

    @Column(name = "\"BriefDescription\"")
    private String RequestText;

    @Column(name = "\"CardCode\"")
    private String cardCode;

    @Column(name = "\"SupportGroupID\"")
    private Integer technicienId;

    @Column(name = "\"IssueType\"")
    private Integer Type;

    @Column(name = "\"Status\"")
    private Integer etat;

    @Column(name = "\"Priority\"")
    private Integer priority;

    @Column(name = "\"ProjectNumber\"")
    private String projectNumber;

    @Column(name = "\"RequestDate\"")
    private String requestDate;

    @Column(name = "\"USER_DateReceptionEmail\"")
    private String date_reception;

    @Column(name = "\"USER_DateCloture\"")
    private String date_cloture;

    @Column(name = "\"USER_HeureCloture\"")
    private String heureCloture;

    @Column(name = "\"SLA_ID\"")
    private Integer slaId;

    @Column(name = "\"ProductID\"")
    private Integer productId;

}
