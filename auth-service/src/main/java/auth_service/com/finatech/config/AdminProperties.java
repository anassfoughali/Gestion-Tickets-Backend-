package auth_service.com.finatech.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix="app.admin")

public class AdminProperties {
    // Correspond à app.admin.username dans application.yaml
    private String username;
    // Correspond à app.admin.password dans application.yaml
    private String password;

}
