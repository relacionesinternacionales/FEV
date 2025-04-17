package com.example.fevbackend.Data.Repository;

import com.example.fevbackend.Logic.Model.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Integer> {
    List<Puesto> findPuestosByEmpresa_Id(Integer id);
}
