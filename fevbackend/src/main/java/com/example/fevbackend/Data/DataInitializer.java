package com.example.fevbackend.Data;

import com.example.fevbackend.Data.Repository.RolesRepository;
import com.example.fevbackend.Logic.Model.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public void run(String... args) {
        if (rolesRepository.count() == 0) { // Verifica si ya hay roles
            rolesRepository.save(new Role("ROLE_ADMIN"));
            rolesRepository.save(new Role("ROLE_EMPRESA"));
            System.out.println("Roles inicializados en la base de datos.");
        } else {
            System.out.println("Los roles ya existen, no se insertaron nuevos datos.");
        }
    }
}

