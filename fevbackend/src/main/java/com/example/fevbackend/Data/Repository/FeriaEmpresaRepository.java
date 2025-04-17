package com.example.fevbackend.Data.Repository;

import com.example.fevbackend.Logic.Model.FeriaEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeriaEmpresaRepository extends JpaRepository<FeriaEmpresa, Integer> {
}
