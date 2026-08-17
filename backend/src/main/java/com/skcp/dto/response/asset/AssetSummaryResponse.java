package com.skcp.dto.response.asset;

/*
 * Lightweight response DTO used for asset lists and search results.
 *
 * Detailed asset information is intentionally excluded.
 *
 * Asset Entity
 *      ↓
 * AssetMapper
 *      ↓
 * AssetSummaryResponse
 *      ↓
 * Asset List / Search
 */

public class AssetSummaryResponse
{
    private Integer assetId;

    private String assetName;

    private String assetCategory;

    private String location;

    private String status;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AssetSummaryResponse()
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
}