package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.labour.LabourCreateRequest;
import com.skcp.dto.request.labour.LabourUpdateRequest;
import com.skcp.dto.response.labour.LabourResponse;
import com.skcp.dto.response.labour.LabourSummaryResponse;
import com.skcp.service.LabourService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labours")
public class LabourController
{

    private final LabourService labourService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public LabourController(LabourService labourService)
    {
        this.labourService = labourService;
    }


    // ============================================================
    // GET ALL LABOURS
    // ============================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<LabourSummaryResponse>>> getAllLabours()
    {
        List<LabourSummaryResponse> labours =
                labourService.getAllLabours();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Labours retrieved successfully",
                        labours
                )
        );
    }


    // ============================================================
    // GET LABOUR BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabourResponse>> getLabourById(
            @PathVariable Integer id
    )
    {
        LabourResponse labour =
                labourService.getLabourById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Labour retrieved successfully",
                        labour
                )
        );
    }


    // ============================================================
    // CREATE LABOUR
    // ============================================================

    @PostMapping
    public ResponseEntity<ApiResponse<LabourResponse>> createLabour(
            @Valid @RequestBody LabourCreateRequest request
    )
    {
        LabourResponse savedLabour =
                labourService.createLabour(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Labour created successfully",
                        savedLabour
                )
        );
    }


    // ============================================================
    // UPDATE LABOUR
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LabourResponse>> updateLabour(
            @PathVariable Integer id,
            @Valid @RequestBody LabourUpdateRequest request
    )
    {
        LabourResponse updatedLabour =
                labourService.updateLabour(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Labour updated successfully",
                        updatedLabour
                )
        );
    }


    // ============================================================
    // DELETE LABOUR
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLabour(
            @PathVariable Integer id
    )
    {
        labourService.deleteLabour(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Labour deleted successfully",
                        null
                )
        );
    }

}












/* 

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

*/