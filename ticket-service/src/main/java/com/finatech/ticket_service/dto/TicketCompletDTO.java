package com.finatech.ticket_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketCompletDTO {

    private int IssueId ;
    private String object ;
    private String Description ;
    private String Status ;
    private String Priorite ;
    private String date_reception;
    private String date_cloture;
    private String durée_resolution ;
    private String client ;
    private String IssueType ;


}
