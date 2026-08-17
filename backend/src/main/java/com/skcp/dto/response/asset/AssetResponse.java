package com.skcp.dto.response.asset;

import java.time.LocalDate;
import java.time.LocalDateTime;

/*
 Response DTO.
 
 No validation annotations are required here because
 this class is used to send data from the backend to the client.
 
 Asset Entity
      ↓
 AssetMapper
      ↓
 AssetResponse
      ↓
 Controller
     ↓
 Postman / Frontend
 */

public class AssetResponse
{
    private Integer assetId;

    private String assetName;

    private String assetCategory;

    private String manufacturer;

    private String modelNumber;

    private String serialNumber;

    private LocalDate purchaseDate;

    private LocalDate installationDate;

    private String location;

    /*
     status is backend-controlled.
     
     It is excluded from request DTOs because the client
     should not directly control the asset lifecycle status.
     
     It is included here because the backend can return
     the current status to the client.
     */
    
    private String status;

    private LocalDate lastMaintenanceDate;

    private LocalDate nextMaintenanceDate;

    private String notes;

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AssetResponse()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getAssetId()
    {
        return assetId;
    }

    public void setAssetId(Integer assetId)
    {
        this.assetId = assetId;
    }

    public String getAssetName()
    {
        return assetName;
    }

    public void setAssetName(String assetName)
    {
        this.assetName = assetName;
    }

    public String getAssetCategory()
    {
        return assetCategory;
    }

    public void setAssetCategory(String assetCategory)
    {
        this.assetCategory = assetCategory;
    }

    public String getManufacturer()
    {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer)
    {
        this.manufacturer = manufacturer;
    }

    public String getModelNumber()
    {
        return modelNumber;
    }

    public void setModelNumber(String modelNumber)
    {
        this.modelNumber = modelNumber;
    }

    public String getSerialNumber()
    {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber)
    {
        this.serialNumber = serialNumber;
    }

    public LocalDate getPurchaseDate()
    {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate)
    {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getInstallationDate()
    {
        return installationDate;
    }

    public void setInstallationDate(LocalDate installationDate)
    {
        this.installationDate = installationDate;
    }

    public String getLocation()
    {
        return location;
    }

    public void setLocation(String location)
    {
        this.location = location;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public LocalDate getLastMaintenanceDate()
    {
        return lastMaintenanceDate;
    }

    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate)
    {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public LocalDate getNextMaintenanceDate()
    {
        return nextMaintenanceDate;
    }

    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate)
    {
        this.nextMaintenanceDate = nextMaintenanceDate;
    }

    public String getNotes()
    {
        return notes;
    }

    public void setNotes(String notes)
    {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }
}