package com.example.fevbackend.Data.Repository;

import com.example.fevbackend.Logic.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT c FROM User c WHERE c.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

}
