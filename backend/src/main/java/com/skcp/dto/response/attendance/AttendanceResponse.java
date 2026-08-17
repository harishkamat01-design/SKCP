package com.skcp.dto.response.attendance;

import com.skcp.enums.RecordStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponse
{

    // ============================================================
    // ATTENDANCE
    // ============================================================

    private Integer attendanceId;

    private LocalDate attendanceDate;

    private String attendanceStatus;

    private String leaveReason;


    // ============================================================
    // LABOUR
    // ============================================================

    private Integer labourId;

    private String labourName;


    // ============================================================
    // PAYMENT INFORMATION
    // ============================================================

    private BigDecimal dailyRate;

    private BigDecimal dailyAmount;


    // ============================================================
    // OTHER
    // ============================================================

    private String remarks;


    // ============================================================
    // RECORD STATUS
    // ============================================================

    private RecordStatus status;


    // ============================================================
    // AUDIT
    // ============================================================

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceResponse()
    {

    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getAttendanceId()
    {
        return attendanceId;
    }

    public void setAttendanceId(Integer attendanceId)
    {
        this.attendanceId = attendanceId;
    }


    public LocalDate getAttendanceDate()
    {
        return attendanceDate;
    }

    public void setAttendanceDate(
            LocalDate attendanceDate
    )
    {
        this.attendanceDate = attendanceDate;
    }


    public String getAttendanceStatus()
    {
        return attendanceStatus;
    }

    public void setAttendanceStatus(
            String attendanceStatus
    )
    {
        this.attendanceStatus = attendanceStatus;
    }


    public String getLeaveReason()
    {
        return leaveReason;
    }

    public void setLeaveReason(
            String leaveReason
    )
    {
        this.leaveReason = leaveReason;
    }


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


    public BigDecimal getDailyRate()
    {
        return dailyRate;
    }

    public void setDailyRate(BigDecimal dailyRate)
    {
        this.dailyRate = dailyRate;
    }


    public BigDecimal getDailyAmount()
    {
        return dailyAmount;
    }

    public void setDailyAmount(
            BigDecimal dailyAmount
    )
    {
        this.dailyAmount = dailyAmount;
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
    }


    public RecordStatus getStatus()
    {
        return status;
    }

    public void setStatus(RecordStatus status)
    {
        this.status = status;
    }


    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    )
    {
        this.createdAt = createdAt;
    }
}




/*
package com.skcp.dto.response.attendance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponse
{

    // ============================================================
    // ATTENDANCE
    // ============================================================

    private Integer attendanceId;

    private LocalDate attendanceDate;

    private String attendanceStatus;

    private String leaveReason;


    // ============================================================
    // LABOUR
    // ============================================================

    private Integer labourId;

    private String labourName;


    // ============================================================
    // PAYMENT INFORMATION
    // ============================================================

    private BigDecimal dailyRate;

    private BigDecimal dailyAmount;


    // ============================================================
    // OTHER
    // ============================================================

    private String remarks;

    private LocalDateTime createdAt;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceResponse()
    {
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getAttendanceId()
    {
        return attendanceId;
    }

    public void setAttendanceId(Integer attendanceId)
    {
        this.attendanceId = attendanceId;
    }


    public LocalDate getAttendanceDate()
    {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate)
    {
        this.attendanceDate = attendanceDate;
    }


    public String getAttendanceStatus()
    {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus)
    {
        this.attendanceStatus = attendanceStatus;
    }


    public String getLeaveReason()
    {
        return leaveReason;
    }

    public void setLeaveReason(String leaveReason)
    {
        this.leaveReason = leaveReason;
    }


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


    public BigDecimal getDailyRate()
    {
        return dailyRate;
    }

    public void setDailyRate(BigDecimal dailyRate)
    {
        this.dailyRate = dailyRate;
    }


    public BigDecimal getDailyAmount()
    {
        return dailyAmount;
    }

    public void setDailyAmount(BigDecimal dailyAmount)
    {
        this.dailyAmount = dailyAmount;
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = remarks;
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


*/