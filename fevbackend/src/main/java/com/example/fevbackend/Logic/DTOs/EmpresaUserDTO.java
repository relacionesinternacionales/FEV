package com.example.fevbackend.Logic.DTOs;

import com.example.fevbackend.Logic.Model.Empresa;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaUserDTO {
    private Empresa empresa;
    private String password;
}
