package com.skcp.dto.request.labour;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LabourCreateRequest
{

    @NotBlank(message = "Labour name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Labour name must be between 2 and 100 characters"
    )
    private String labourName;


    @NotBlank(message = "Phone is required")
    @Size(
            min = 10,
            max = 20,
            message = "Phone must be between 10 and 20 characters"
    )
    private String phone;


    @Size(
            max = 500,
            message = "Address must not exceed 500 characters"
    )
    private String address;


    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;


    @NotBlank(message = "Skill type is required")
    @Size(
            min = 2,
            max = 50,
            message = "Skill type must be between 2 and 50 characters"
    )
    private String skillType;


    @NotNull(message = "Daily rate is required")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Daily rate must be greater than 0"
    )
    private BigDecimal dailyRate;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public LabourCreateRequest()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public String getLabourName()
    {
        return labourName;
    }

    public void setLabourName(String labourName)
    {
        this.labourName = normalize(labourName);
    }


    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = normalize(phone);
    }


    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = normalize(address);
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
        this.skillType = normalize(skillType);
    }


    public BigDecimal getDailyRate()
    {
        return dailyRate;
    }

    public void setDailyRate(BigDecimal dailyRate)
    {
        this.dailyRate = dailyRate;
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