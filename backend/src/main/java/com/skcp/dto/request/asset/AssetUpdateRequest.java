package com.skcp.dto.request.asset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class AssetUpdateRequest
{
    @NotBlank(message = "Asset name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Asset name must be between 2 and 100 characters"
    )
    private String assetName;

    @NotBlank(message = "Asset category is required")
    @Size(
            min = 2,
            max = 50,
            message = "Asset category must be between 2 and 50 characters"
    )
    private String assetCategory;

    @Size(
            max = 100,
            message = "Manufacturer must not exceed 100 characters"
    )
    private String manufacturer;

    @Size(
            max = 100,
            message = "Model number must not exceed 100 characters"
    )
    private String modelNumber;

    @Size(
            max = 100,
            message = "Serial number must not exceed 100 characters"
    )
    private String serialNumber;

    private LocalDate purchaseDate;

    private LocalDate installationDate;

    @Size(
            max = 100,
            message = "Location must not exceed 100 characters"
    )
    private String location;

    @Size(
            max = 500,
            message = "Notes must not exceed 500 characters"
    )
    private String notes;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AssetUpdateRequest()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public String getAssetName()
    {
        return assetName;
    }

    public void setAssetName(String assetName)
    {
        this.assetName = normalize(assetName);
    }

    public String getAssetCategory()
    {
        return assetCategory;
    }

    public void setAssetCategory(String assetCategory)
    {
        this.assetCategory = normalize(assetCategory);
    }

    public String getManufacturer()
    {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer)
    {
        this.manufacturer = normalize(manufacturer);
    }

    public String getModelNumber()
    {
        return modelNumber;
    }

    public void setModelNumber(String modelNumber)
    {
        this.modelNumber = normalize(modelNumber);
    }

    public String getSerialNumber()
    {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber)
    {
        this.serialNumber = normalize(serialNumber);
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
        this.location = normalize(location);
    }

    public String getNotes()
    {
        return notes;
    }

    public void setNotes(String notes)
    {
        this.notes = normalize(notes);
    }


    // ============================================================
    // NORMALIZATION HELPER
    // ============================================================

    private String normalize(String value)
    {
        if (value == null)
        {
            return null;
        }

        String trimmedValue = value.trim();

        return trimmedValue.isEmpty()
                ? null
                : trimmedValue;
    }
}