package com.skcp.dto.response.labour;

/*
 * Lightweight response DTO used for labour lists and search results.
 *
 * Detailed labour information is intentionally excluded.
 *
 * Labour Entity
 *      ↓
 * LabourMapper
 *      ↓
 * LabourSummaryResponse
 *      ↓
 * Labour List / Search
 */

public class LabourSummaryResponse
{
    private Integer labourId;

    private String labourName;

    private String phone;

    private String skillType;

    private String status;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public LabourSummaryResponse()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getLabourId()
    {
        return labourId;
    }

    public void setLabourId(Integer labourId)
    {
        this.labourId = labourId;
    }

    public String getLabourName()
    {
        return labourName;
    }

    public void setLabourName(String labourName)
    {
        this.labourName = labourName;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getSkillType()
    {
        return skillType;
    }

    public void setSkillType(String skillType)
    {
        this.skillType = skillType;
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