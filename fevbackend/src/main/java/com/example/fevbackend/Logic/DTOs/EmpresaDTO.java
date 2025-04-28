package com.example.fevbackend.Logic.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    @NotNull(message = "El ID es obligatorio")
    private Integer id;
    @NotNull(message = "La cedula es obligatoria")
    private String cedula;
    @NotNull(message = "El nombre es obligatorio")
    private String nombre;
    @NotNull(message = "El nombre es obligatorio")
    private String descripcion;
    @NotNull(message = "El nombre es obligatorio")
    private String correo;
    private String codigoPais1;
    private String codigoPais2;
    private String telefono1;
    private String telefono2;
    private String web;
    private String imagen;
    private String imagenTipo;
}