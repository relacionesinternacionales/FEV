package com.example.fevbackend.Logic.DTOs;

import jakarta.persistence.*;
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
public class PuestoCreatDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Lob
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
    private String url;
    private String imagen;
    private String imagenTipo;
    private String estado;

    //------------------------------------------------------------------------------------------------------------------
    // Relacion
    //------------------------------------------------------------------------------------------------------------------
    @NotNull(message = "El ID de la empresa es obligatorio")
    private Integer empresaId;
}
