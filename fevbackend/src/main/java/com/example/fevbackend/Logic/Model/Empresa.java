package com.example.fevbackend.Logic.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "empresa")
public class Empresa {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cedula", nullable = false, length = 50, unique = true)
    private String cedula;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "correo", nullable = false, unique = true)
    private String correo;

    @Column(name = "correo_postulantes")
    private String correoPostulantes;

    @Column(name = "codigo_pais1", nullable = false, length = 5)
    private String codigoPais1;

    @Column(name = "codigo_pais2", nullable = false, length = 5)
    private String codigoPais2;

    @Column(name = "telefono1", nullable = false, length = 15)
    private String telefono1;

    @Column(name = "telefono2", length = 15)
    private String telefono2;

    @Column(name = "whatsapp", nullable = false, length = 15)
    private String whatsapp;

    @Column(name = "web", nullable = false)
    private String web;

    @Column(name = "logo")
    private String logo;

    //------------------------------------------------------------------------------------------------------------------
    // Relacion
    //------------------------------------------------------------------------------------------------------------------
    @OneToOne(optional = false)
    @JsonIgnoreProperties({"empresa"})
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}