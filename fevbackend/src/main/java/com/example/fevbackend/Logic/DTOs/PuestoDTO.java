package com.example.fevbackend.Logic.DTOs;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PuestoDTO {

    @NotNull(message = "El ID es obligatorio")
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Lob
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
    private String url;
    private String imagen;
    private String imagenTipo;
    private String estado;
}
