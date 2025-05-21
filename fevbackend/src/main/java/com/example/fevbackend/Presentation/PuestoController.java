package com.example.fevbackend.Presentation;

import com.example.fevbackend.Logic.DTOs.PuestoCreatDTO;
import com.example.fevbackend.Logic.DTOs.PuestoDTO;
import com.example.fevbackend.Logic.Model.Puesto;
import com.example.fevbackend.Logic.Service;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PermitAll
@RestController
@CrossOrigin("*")
@RequestMapping("api/v1/puesto")
@Validated
public class PuestoController {
    //------------------------------------------------------------------------------------------------------------------
    // Atributos
    //------------------------------------------------------------------------------------------------------------------
    @Autowired
    private Service service;

    //------------------------------------------------------------------------------------------------------------------
    // Metodos
    //------------------------------------------------------------------------------------------------------------------

    //Get All
    @GetMapping
    public ResponseEntity<List<Puesto>> getPuestos() {
        List<Puesto> puestos = service.getPuestos();

        //Empty List
        if(puestos.isEmpty())
        {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(puestos);
    }

    @GetMapping("/empresaId/{id}")
    public ResponseEntity<List<Puesto>> getPuestosByEmpresaId(@PathVariable Integer id)
    {
        List<Puesto> puestos = service.getPuestosByEmpresaId(id);

        if(puestos.isEmpty())
        {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(puestos);
    }

    //Get by Id
    @GetMapping("/{id}")
    public ResponseEntity<Puesto> getPuesto(@PathVariable Integer id) {
        //Check Id
        if(id == null || id <= 0)
        {
            return ResponseEntity.noContent().build();
        }

        Puesto puesto = service.getPuesto(id);

        //IF puesto is not found
        if(puesto == null) { return ResponseEntity.notFound().build(); }

        return ResponseEntity.ok(puesto);
    }

    // Endpoint para obtener imagen directamente
    @GetMapping("/{id}/imagen")
    public ResponseEntity<?> getImagen(@PathVariable Integer id) {
        Puesto puesto = service.getPuesto(id);

        if (puesto == null || puesto.getImagen() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = puesto.getImagenTipo() != null ? puesto.getImagenTipo() : "image/jpeg";

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(puesto.getImagen());
    }

    // Add
    @PostMapping
    public ResponseEntity<Puesto> addPuesto(@Valid @RequestBody PuestoCreatDTO puesto) {
        // Puesto null
        if(puesto == null) { return ResponseEntity.noContent().build(); }

        //Otras validaciones y reglas


        // Guardar
        try{
            Puesto newPuesto = service.addPuesto(puesto);

            return ResponseEntity.ok(newPuesto);
        } catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Puesto> updatePuesto(@PathVariable("id") Integer id, @Valid @RequestBody PuestoDTO puestoDTO
    ) {
        // Check Id
        if (id == null || id <= 0 || !id.equals(puestoDTO.getId())) {
            return ResponseEntity.badRequest().build();
        }

        // Check Puesto
        if (!service.existsPuesto(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            Puesto feriaActualizada = service.updatePuesto(id, puestoDTO);
            return ResponseEntity.ok(feriaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePuesto(@PathVariable("id") Integer id) {
        // Validar ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // Check Puestos
        if (!service.existsPuesto(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            service.deletePuesto(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}