package com.example.fevbackend.Logic.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaUserDTO {
    private EmpresaCreateDTO empresa;
    private String password;
}
