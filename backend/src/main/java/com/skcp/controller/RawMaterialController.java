package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.rawmaterial.RawMaterialCreateRequest;
import com.skcp.dto.request.rawmaterial.RawMaterialUpdateRequest;
import com.skcp.dto.response.rawmaterial.RawMaterialResponse;
import com.skcp.dto.response.rawmaterial.RawMaterialSummaryResponse;
import com.skcp.service.RawMaterialService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public RawMaterialController(
            RawMaterialService rawMaterialService) {

        this.rawMaterialService = rawMaterialService;
    }


    // ============================================================
    // GET ALL RAW MATERIALS
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<RawMaterialSummaryResponse>>
            > getAllRawMaterials() {

        List<RawMaterialSummaryResponse> rawMaterials =
                rawMaterialService.getAllRawMaterials();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw materials retrieved successfully",
                        rawMaterials
                )
        );
    }


    // ============================================================
    // GET RAW MATERIAL BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<RawMaterialResponse>
            > getRawMaterialById(
                    @PathVariable Integer id) {

        RawMaterialResponse rawMaterial =
                rawMaterialService.getRawMaterialById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw material retrieved successfully",
                        rawMaterial
                )
        );
    }


    // ============================================================
    // CREATE RAW MATERIAL
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<RawMaterialResponse>
            > createRawMaterial(
                    @Valid
                    @RequestBody RawMaterialCreateRequest request) {

        RawMaterialResponse savedRawMaterial =
                rawMaterialService.createRawMaterial(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "Raw material created successfully",
                        savedRawMaterial
                )
        );
    }


    // ============================================================
    // UPDATE RAW MATERIAL
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<RawMaterialResponse>
            > updateRawMaterial(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody RawMaterialUpdateRequest request) {

        RawMaterialResponse updatedRawMaterial =
                rawMaterialService.updateRawMaterial(
                        id,
                        request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Raw material updated successfully",
                        updatedRawMaterial
                )
        );
    }


    // ============================================================
    // DELETE RAW MATERIAL
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteRawMaterial(
                    @PathVariable Integer id) {

        rawMaterialService.deleteRawMaterial(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Raw material deleted successfully",
                        null
                )
        );
    }
}




/*
We’ll keep it aligned with the SKCP Master Entity API standard we established for Customer, Supplier, and Product:

GET → 200 OK
POST → 201 CREATED
PUT → 200 OK
DELETE → 200 OK
All successful responses use ApiResponse<T>
@Valid on request DTOs


API structure:
GET    /api/raw-materials
GET    /api/raw-materials/{id}
POST   /api/raw-materials
PUT    /api/raw-materials/{id}
DELETE /api/raw-materials/{id}

HTTP standard:
| Operation | HTTP Status | Response |
|-------|----------|--------------------------------------------------|
| GET all | `200 OK` | `ApiResponse<List<RawMaterialSummaryResponse>>` |

| GET by ID | `200 OK` | `ApiResponse<RawMaterialResponse>` |
| CREATE | `201 CREATED` | `ApiResponse<RawMaterialResponse>` |
| UPDATE | `200 OK` | `ApiResponse<RawMaterialResponse>` |

| DELETE | `200 OK` | `ApiResponse<Void>` |


Important:
The DELETE deliberately uses 200 OK, not 204 No Content, because SKCP wants to return:
success
message
data
timestamp

That keeps the Master Entity APIs consistent.

*/


/*
package com.skcp.controller;

import com.skcp.entity.RawMaterial;
import com.skcp.service.RawMaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {

    // Dependency Injection
    private final RawMaterialService rawMaterialService;

    // Constructor Injection
    public RawMaterialController(RawMaterialService rawMaterialService) {
        this.rawMaterialService = rawMaterialService;
    }

    // Get all raw materials
    @GetMapping
    public ResponseEntity<List<RawMaterial>> getAllRawMaterials() {

        List<RawMaterial> rawMaterials = rawMaterialService.getAllRawMaterials();

        return ResponseEntity.ok(rawMaterials);
    }

    // Get raw material by ID
    @GetMapping("/{id}")
    public ResponseEntity<RawMaterial> getRawMaterialById(@PathVariable Integer id) {

        RawMaterial rawMaterial = rawMaterialService.getRawMaterialById(id);

        if (rawMaterial == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rawMaterial);
    }

    // Create raw material
    @PostMapping
    public ResponseEntity<RawMaterial> createRawMaterial(@RequestBody RawMaterial rawMaterial) {

        RawMaterial savedRawMaterial = rawMaterialService.saveRawMaterial(rawMaterial);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRawMaterial);
    }

  // Update raw material
@PutMapping("/{id}")
public ResponseEntity<RawMaterial> updateRawMaterial(
        @PathVariable Integer id,
        @RequestBody RawMaterial rawMaterial) {

    RawMaterial existingRawMaterial = rawMaterialService.getRawMaterialById(id);

    if (existingRawMaterial == null) {
        return ResponseEntity.notFound().build();
    }

    // Update only editable fields
    existingRawMaterial.setMaterialName(rawMaterial.getMaterialName());
    existingRawMaterial.setMaterialCategory(rawMaterial.getMaterialCategory());
    existingRawMaterial.setDescription(rawMaterial.getDescription());
    existingRawMaterial.setStatus(rawMaterial.getStatus());

    RawMaterial updatedRawMaterial =
            rawMaterialService.saveRawMaterial(existingRawMaterial);

    return ResponseEntity.ok(updatedRawMaterial);
}

    // Delete raw material
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRawMaterial(@PathVariable Integer id) {

        RawMaterial existingRawMaterial = rawMaterialService.getRawMaterialById(id);

        if (existingRawMaterial == null) {
            return ResponseEntity.notFound().build();
        }

        rawMaterialService.deleteRawMaterial(id);

        return ResponseEntity.noContent().build();
    }
}







*/