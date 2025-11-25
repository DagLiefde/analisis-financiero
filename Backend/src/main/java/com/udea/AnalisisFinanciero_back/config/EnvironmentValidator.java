package com.udea.AnalisisFinanciero_back.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvironmentValidator implements InitializingBean {

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${jwt.expirationMs:0}")
    private int jwtExpiration;

    @Value("${spring.datasource.username:}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Override
    public void afterPropertiesSet() {
        validateEnvironmentVariables();
    }

    private void validateEnvironmentVariables() {
        StringBuilder errors = new StringBuilder();

        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            errors.append("La variable jwt.secret no está configurada en application.properties.\n");
        }

        if (jwtExpiration <= 0) {
            errors.append("La variable jwt.expirationMs no está configurada correctamente en application.properties.\n");
        }

        if (dbUsername == null || dbUsername.trim().isEmpty()) {
            errors.append("La variable spring.datasource.username no está configurada en application.properties.\n");
        }

        // Permitir contraseña vacía para desarrollo local (Homebrew PostgreSQL no requiere contraseña para el usuario del sistema)
        // Solo validamos si el username está configurado y no es el usuario del sistema
        if (dbUsername != null && !dbUsername.trim().isEmpty() && 
            !dbUsername.equals(System.getProperty("user.name")) && 
            (dbPassword == null || dbPassword.trim().isEmpty())) {
            errors.append("La variable spring.datasource.password debe estar configurada cuando se usa un usuario diferente al del sistema.\n");
        }

        if (errors.length() > 0) {
            throw new IllegalStateException(
                    "Error en la configuración del entorno:\n" + errors.toString() +
                            "Por favor configure las propiedades en application.properties.");
        }
    }
}
