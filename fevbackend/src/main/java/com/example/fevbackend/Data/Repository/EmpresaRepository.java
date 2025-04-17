package com.example.fevbackend.Data.Repository;

import com.example.fevbackend.Logic.Model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    boolean existsByNombreOrCedula(String nombre, String cedula);

    Optional<Empresa> findEmpresaByCorreo(String correo);
}
