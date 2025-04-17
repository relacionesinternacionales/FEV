package com.example.fevbackend.Data.Repository;

import com.example.fevbackend.Logic.Model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT c FROM Role c WHERE c.name = :name")
    Optional<Role> findByName(@Param("name") String name);
}
