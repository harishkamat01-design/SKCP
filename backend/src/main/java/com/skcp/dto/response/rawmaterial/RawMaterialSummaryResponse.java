package com.skcp.dto.response.rawmaterial;

import com.skcp.enums.RawMaterialUnit;

public class RawMaterialSummaryResponse {

    private Integer rawMaterialId;
    private String materialName;
    private String materialCategory;
    private RawMaterialUnit unit;
    private String status;


    // Default Constructor

    public RawMaterialSummaryResponse() {

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}


/*

This DTO is used for list / summary responses, so we keep it smaller than RawMaterialResponse.

Why Summary Response is smaller.


1.For
GET /api/raw-materials

we don't need to return every field such as description and createdAt.

RawMaterialSummaryResponse
│
├── rawMaterialId
├── materialName
├── materialCategory
└── status

2.
For:
GET /api/raw-materials/{id}
we use the detailed:

RawMaterialResponse
│
├── rawMaterialId
├── materialName
├── materialCategory
├── description
├── status
└── createdAt



*/