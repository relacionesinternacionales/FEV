package com.example.fevbackend.Presentation;

import com.example.fevbackend.Logic.DTOs.EmpresaDTO;
import com.example.fevbackend.Logic.DTOs.EmpresaUserDTO;
import com.example.fevbackend.Logic.Model.Empresa;
import com.example.fevbackend.Logic.Model.Puesto;
import com.example.fevbackend.Logic.Model.User;
import com.example.fevbackend.Logic.Service;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PermitAll
@RestController
@CrossOrigin("*")
@RequestMapping("api/v1/empresa")
@Validated
public class EmpresaController {
    //------------------------------------------------------------------------------------------------------------------
    // Atributos
    //------------------------------------------------------------------------------------------------------------------
    @Autowired
    private Service service;

    //------------------------------------------------------------------------------------------------------------------
    // Metodos
    //------------------------------------------------------------------------------------------------------------------

    // Get All
    @GetMapping
    public ResponseEntity<List<Empresa>> getEmpresas() {
        List<Empresa> empresas = service.getEmpresas();

        // Manejar caso de lista vacía
        if (empresas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(empresas);
    }

    // Get by Id
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getEmpresa(@PathVariable("id") Integer id) {
        // Validar que el ID no sea nulo o negativo
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Empresa empresa = service.getEmpresa(id);

        // Manejar caso de empresa no encontrada
        if (empresa == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(empresa);
    }

    // Get Id by Email
    @GetMapping("/email/{username}")
    public Integer getEmpresaIdByEmail(@PathVariable("username") String username) {
        return service.getEmpresaIdByCorreo(username);
    }

    // Endpoint para obtener imagen directamente
    @GetMapping("/{id}/imagen")
    public ResponseEntity<?> getImagen(@PathVariable Integer id) {
        Empresa empresa = service.getEmpresa(id);

        if (empresa == null || empresa.getImagen() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = empresa.getImagenTipo() != null ? empresa.getImagenTipo() : "image/jpeg";

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(empresa.getImagen());
    }

    // Add
    @PostMapping
    public ResponseEntity<?> addEmpresa(@Valid @RequestBody EmpresaUserDTO dto, BindingResult result) {
        // Validaciones básicas para la empresa
        if (dto.getEmpresa() == null) {
            return ResponseEntity.badRequest().build();
        }

        Empresa empresa = dto.getEmpresa();

        // Validar campos obligatorios
        if (empresa.getNombre() == null || empresa.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Verificar si la empresa ya existe
        if (service.existsByNombreOrCedula(empresa.getNombre(), empresa.getCedula())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        try {
            // Crear el usuario asociado
            User user = new User();
            user.setUsername(empresa.getCorreo());
            user.setPassword(dto.getPassword());
            user.setEnable(true);
            user.setIsAdmin(false);

            // Usar directamente el servicio para guardar el usuario
            User savedUser = service.addUser(user);

            // Establecer relación y guardar empresa
            empresa.setUser(savedUser);
            Empresa nuevaEmpresa = service.addEmpresa(empresa);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaEmpresa);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> updateEmpresa( @PathVariable("id") Integer id, @Valid @RequestBody EmpresaDTO empresaDTO
    ) {
        // Validar que el ID de la ruta coincida con el ID de la empresa
        if (id == null || id <= 0 || !id.equals(empresaDTO.getId())) {
            return ResponseEntity.badRequest().build();
        }

        // Verificar si la empresa existe
        if (service.existsEmpresa(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            Empresa empresaActualizada = service.updateEmpresa(id, empresaDTO);
            return ResponseEntity.ok(empresaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpresa(@PathVariable("id") Integer id) {
        // Validar ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // Verificar si la empresa existe
        if (service.existsEmpresa(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            service.deleteEmpresa(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
