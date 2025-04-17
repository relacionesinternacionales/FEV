package com.example.fevbackend.Presentation;

import com.example.fevbackend.Logic.Model.Feria;
import com.example.fevbackend.Logic.Service;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PermitAll
@RestController
@CrossOrigin("*")
@RequestMapping("api/v1/feria")
@Validated
public class FeriaController {
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
    public ResponseEntity<List<Feria>> getFerias() {
        List<Feria> ferias = service.getFerias();

        //Empty List
        if(ferias.isEmpty())
        {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(ferias);
    }

    //Get by Id
    @GetMapping("/{id}")
    public ResponseEntity<Feria> getFeria(@PathVariable Integer id) {
        //Check Id
        if(id == null || id <= 0)
        {
            return ResponseEntity.noContent().build();
        }

        Feria feria = service.getFeria(id);

        //IF feria is not found
        if(feria == null) { return ResponseEntity.noContent().build(); }

        return ResponseEntity.ok(feria);
    }

    // Add
    @PostMapping
    public ResponseEntity<Feria> addFeria(@Valid @RequestBody Feria feria) {
        // Feria null
        if(feria == null) { return ResponseEntity.noContent().build(); }

        //Otras validaciones y reglas

        // Guardar
        try{
            Feria newFeria = service.addFeria(feria);

            return ResponseEntity.ok(newFeria);
        } catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Feria> updateFeria(@PathVariable("id") Integer id, @Valid @RequestBody Feria feria
    ) {
        // Check Id
        if (id == null || id <= 0 || !id.equals(feria.getId())) {
            return ResponseEntity.badRequest().build();
        }

        // Check feria
        if (service.existsFeria(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            Feria feriaActualizada = service.updateFeria(id, feria);
            return ResponseEntity.ok(feriaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeria(@PathVariable("id") Integer id) {
        // Validar ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // Check Ferias
        if (service.existsFeria(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            service.deleteFeria(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
