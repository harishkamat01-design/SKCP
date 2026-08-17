package com.skcp.dto.response.labour;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/*
 * Response DTO.
 *
 * No validation annotations are required here because
 * this class is used to send data from the backend to the client.
 *
 * Labour Entity
 *      ↓
 * LabourMapper
 *      ↓
 * LabourResponse
 *      ↓
 * Controller
 *      ↓
 * Postman / Frontend
 */

public class LabourResponse
{
    private Integer labourId;

    private String labourName;

    private String phone;

    private String address;

    private LocalDate joiningDate;

    private String skillType;

    private BigDecimal dailyRate;

    /*
     * status is backend-controlled.
     *
     * It is excluded from request DTOs because
     * the client should not directly control
     * the labour lifecycle status.
     *
     * It is included here because the backend
     * can return the current status to the client.
     */
    private String status;

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public LabourResponse()
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

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public LocalDate getJoiningDate()
    {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate)
    {
        this.joiningDate = joiningDate;
    }

    public String getSkillType()
    {
        return skillType;
    }

    public void setSkillType(String skillType)
    {
        this.skillType = skillType;
    }

    public BigDecimal getDailyRate()
    {
        return dailyRate;
    }

    public void setDailyRate(BigDecimal dailyRate)
    {
        this.dailyRate = dailyRate;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
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