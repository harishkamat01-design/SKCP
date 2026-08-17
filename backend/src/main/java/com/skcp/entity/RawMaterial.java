package com.skcp.entity;

import com.skcp.enums.RawMaterialUnit;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "raw_material")
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "raw_material_id")
    private Integer rawMaterialId;

    @Column(name = "material_name", nullable = false, length = 100)
    private String materialName;

    @Column(name = "material_category", nullable = false, length = 50)
    private String materialCategory;

    @Column(name = "unit", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RawMaterialUnit unit;

    @Column(name = "description")
    private String description;

    @Column(name = "status", nullable = false, length = 10)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        if (this.status == null || this.status.isBlank()) {
            this.status = "ACTIVE";
        }
    }

    // Default Constructor

    public RawMaterial() {

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