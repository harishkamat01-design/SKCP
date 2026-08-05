package com.skcp.controller;

import com.skcp.entity.Labour;
import com.skcp.service.LabourService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labours")
public class LabourController {

    // Dependency Injection
    private final LabourService labourService;

    // Constructor Injection
    public LabourController(LabourService labourService) {
        this.labourService = labourService;
    }

    // Get all labours
    @GetMapping
    public ResponseEntity<List<Labour>> getAllLabours() {

        List<Labour> labours = labourService.getAllLabours();

        return ResponseEntity.ok(labours);
    }

    // Get labour by ID
    @GetMapping("/{id}")
    public ResponseEntity<Labour> getLabourById(@PathVariable Integer id) {

        Labour labour = labourService.getLabourById(id);

        if (labour == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(labour);
    }

    // Create labour
    @PostMapping
    public ResponseEntity<Labour> createLabour(@RequestBody Labour labour) {

        Labour savedLabour = labourService.saveLabour(labour);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedLabour);
    }

    // Update labour
    @PutMapping("/{id}")
    public ResponseEntity<Labour> updateLabour(
            @PathVariable Integer id,
            @RequestBody Labour labour) {

        Labour existingLabour = labourService.getLabourById(id);

        if (existingLabour == null) {
            return ResponseEntity.notFound().build();
        }

        // Update only editable fields
        existingLabour.setLabourName(labour.getLabourName());
        existingLabour.setPhone(labour.getPhone());
        existingLabour.setAddress(labour.getAddress());
        existingLabour.setJoiningDate(labour.getJoiningDate());
        existingLabour.setSkillType(labour.getSkillType());
        existingLabour.setDailyRate(labour.getDailyRate());
        existingLabour.setStatus(labour.getStatus());

        Labour updatedLabour = labourService.saveLabour(existingLabour);

        return ResponseEntity.ok(updatedLabour);
    }

    // Delete labour
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabour(@PathVariable Integer id) {

        Labour existingLabour = labourService.getLabourById(id);

        if (existingLabour == null) {
            return ResponseEntity.notFound().build();
        }

        labourService.deleteLabour(id);

        return ResponseEntity.noContent().build();
    }
}