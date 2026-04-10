package com.finatech.ticket_service.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Immutable
@Table(name = "\"MARISupportIssue\"", schema = "\"ZDEV_GP\"")
public class Ticket {
    @Id
    @Column(name = "\"IssueID\"")
    private int id;

    @Column(name = "\"USER_DateCloture\"")
    private String date_cloture;

    @Column(name = "\"USER_DateReceptionEmail\"")
    private String date_reception;

    @Column(name = "\"Status\"")
    private int statusId;

    @Column(name = "\"Priority\"")
    private int priorityId;

    @Column(name = "\"IssueType\"")
    private int issueTypeId;

    // Champs transients pour les descriptions (matchcode)
    @Transient
    private String statusDescription;

    @Transient
    private String priorityDescription;

    @Transient
    private String issueTypeDescription;

    @Column(name = "\"SupportGroupID\"")
    private int technicienId;

    @Column(name = "\"BriefDescription\"")
    private String requestText;

    @Column(name = "\"ProductID\"")
    private int productId;

    // Constantes pour mapping Settings
    private static final int STATUS_SETTING = 1;
    private static final int ISSUE_TYPE_SETTING = 2;
    private static final int PRIORITY_SETTING = 3;

    /**
     * Applique le matchcode depuis MARISupportSettings
     * Transforme les IDs en descriptions lisibles
     */
    public void applyMatchcode(List<Settings> settingsList) {
        for(Settings setting : settingsList) {
            // Vérifie que le Setting correspond au bon type (1=Status, 2=IssueType, 3=Priority)
            if (setting.getSettings() == STATUS_SETTING && setting.getId() == this.statusId) {
                this.statusDescription = setting.getDescription();
            }
            else if (setting.getSettings() == ISSUE_TYPE_SETTING && setting.getId() == this.issueTypeId) {
                this.issueTypeDescription = setting.getDescription();
            }
            else if (setting.getSettings() == PRIORITY_SETTING && setting.getId() == this.priorityId) {
                this.priorityDescription = setting.getDescription();
            }
        }
    }
}