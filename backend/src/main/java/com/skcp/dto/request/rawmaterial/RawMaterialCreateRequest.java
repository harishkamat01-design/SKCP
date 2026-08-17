package com.skcp.dto.request.rawmaterial;

import com.skcp.enums.RawMaterialUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RawMaterialCreateRequest {

    @NotBlank(message = "Material name is required")
    @Size(max = 100, message = "Material name must not exceed 100 characters")
    private String materialName;

    @NotBlank(message = "Material category is required")
    @Size(max = 50, message = "Material category must not exceed 50 characters")
    private String materialCategory;

    @NotNull(message = "Unit is required")
    private RawMaterialUnit unit;

    private String description;


    // Default Constructor

    public RawMaterialCreateRequest() {

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
}

/*
 status, rawMaterialId, and createdAt are backend/database-controlled, they should not be part of the create request.

Request fields:
RawMaterialCreateRequest
│
├── materialName       → User provides
├── materialCategory   → User provides
└── description        → User provides (optional)

Not included:
rawMaterialId    → Database generates
status           → Backend defaults to ACTIVE
createdAt        → Backend generates


This is exactly the separation we want:
Create Request DTO
        ↓
User-controlled fields
        ↓
Mapper
        ↓
RawMaterial Entity
        ↓
Backend-controlled fields
        ↓
PostgreSQL



*/