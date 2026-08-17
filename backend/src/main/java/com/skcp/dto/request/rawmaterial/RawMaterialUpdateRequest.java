package com.skcp.dto.request.rawmaterial;

import com.skcp.enums.RawMaterialUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RawMaterialUpdateRequest {

    @NotBlank(message = "Material name is required")
    @Size(max = 100, message = "Material name must not exceed 100 characters")
    private String materialName;

    @NotBlank(message = "Material category is required")
    @Size(max = 50, message = "Material category must not exceed 50 characters")
    private String materialCategory;

    @NotNull(message = "Unit is required")
    private RawMaterialUnit unit;

    private String description;

    @NotBlank(message = "Status is required")
    @Size(max = 10, message = "Status must not exceed 10 characters")
    private String status;


    // Default Constructor

    public RawMaterialUpdateRequest() {

    }


    // Getters and Setters

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getMaterialCategory() {
        return materialCategory;
    }

    public void setMaterialCategory(String materialCategory) {
        this.materialCategory = materialCategory;
    }

    public RawMaterialUnit getUnit() {
        return unit;
    }

    public void setUnit(RawMaterialUnit unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

/*
Correct. #4 — RawMaterialUpdateRequest.java
For Update, we should allow modification of the business fields, but not:?
MaterialId — database-controlled
createdAt — system-controlled
And  based on the master-entity standard we established, status can be updated intentionally, so the backend can deactivate a raw material without deleting its historical record.

Request responsibility
RawMaterialUpdateRequest
│
├── materialName       → update
├── materialCategory   → update
├── description        → update
└── status             → update

Not included:
rawMaterialId → @PathVariable
createdAt     → never updated

PUT /api/raw-materials/{id}

        ↓

RawMaterialUpdateRequest

        ↓

Validation (@Valid)

        ↓

Product/RawMaterial Mapper

        ↓

Existing RawMaterial Entity

        ↓

Repository.save()

        ↓

RawMaterialResponse
So the PUT request will conceptually be:
 
 




*/