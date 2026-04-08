package com.finatech.ticket_service.repository;
import com.finatech.ticket_service.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface SettingsRepo  extends JpaRepository<Settings, Long> {

 }
