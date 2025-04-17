package com.example.fevbackend.Logic.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "roles")
public class Role {
    //#----------------------------------------------------------------------------------------------------------------#
    // Atributos
    //#----------------------------------------------------------------------------------------------------------------#
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    //#----------------------------------------------------------------------------------------------------------------#
    // Relaciones
    //#----------------------------------------------------------------------------------------------------------------#
    //Esta relacion no es util, nada mas muestra como manejar las referencia ciclicas.
//    @ManyToMany(mappedBy = "roles")
//    @JsonIgnoreProperties({"roles"})
//    private List<User> users;

    //#----------------------------------------------------------------------------------------------------------------#
    // Constructor
    //#----------------------------------------------------------------------------------------------------------------#
    public Role(String name) {
        this.name = name;
    }
}
