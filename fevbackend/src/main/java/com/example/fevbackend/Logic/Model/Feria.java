package com.example.fevbackend.Logic.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "feria")
public class Feria {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "inicio", nullable = false)
    private LocalDate inicio;

    @Column(name = "fin", nullable = false)
    private LocalDate fin;

    @Lob
    @Column(name = "estado", nullable = false)
    private String estado;

}