package com.skcp.dto.response.rawmaterial;

import com.skcp.enums.RawMaterialUnit;
import java.time.LocalDateTime;

public class RawMaterialResponse {

    private Integer rawMaterialId;
    private String materialName;
    private String materialCategory;
    private RawMaterialUnit unit;
    private String description;
    private String status;
    private LocalDateTime createdAt;


    // Default Constructor

    public RawMaterialResponse() {

    }


    // Getters and Setters

    public Integer getRawMaterialId() {
        return rawMaterialId;
    }

    public void setRawMaterialId(Integer rawMaterialId) {
        this.rawMaterialId = rawMaterialId;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


/*

This is the response DTO we return to the frontend after Create, Get, and Update.
It represents the data the API exposes, including backend-generated fields.

Responsibility:

RawMaterialResponse
│
├── rawMaterialId      → Database generated
├── materialName       → Business data
├── materialCategory   → Business data
├── description        → Business data
├── status             → Current master status
└── createdAt          → System generated

So our DTO flow is now:

CREATE

RawMaterialCreateRequest
        ↓
RawMaterial
        ↓
RawMaterialResponse


UPDATE

RawMaterialUpdateRequest
        ↓
RawMaterial
        ↓
RawMaterialResponse

GET

RawMaterial
        ↓
RawMaterialResponse



*/