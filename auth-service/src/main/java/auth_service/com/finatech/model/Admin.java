package auth_service.com.finatech.model;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "users")
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id ;

    @Column(name = "username " , nullable = false)
    private String email ;

    @Column(nullable = false)
    private String password ;
}
