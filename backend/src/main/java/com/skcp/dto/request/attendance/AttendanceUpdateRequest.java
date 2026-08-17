package com.skcp.dto.request.attendance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class AttendanceUpdateRequest
{

    // ============================================================
    // LABOUR ID
    // ============================================================

    @NotNull(message = "Labour ID is required")
    private Integer labourId;


    // ============================================================
    // ATTENDANCE DATE
    // ============================================================

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;


    // ============================================================
    // ATTENDANCE STATUS
    // ============================================================

    @NotBlank(message = "Attendance status is required")
    @Pattern(
            regexp = "PRESENT|ABSENT|HOLIDAY",
            message =
                    "Attendance status must be PRESENT, ABSENT or HOLIDAY"
    )
    private String attendanceStatus;


    // ============================================================
    // LEAVE REASON
    // ============================================================

    @Size(
            max = 100,
            message = "Leave reason must not exceed 100 characters"
    )
    private String leaveReason;


    // ============================================================
    // REMARKS
    // ============================================================

    @Size(
            max = 500,
            message = "Remarks must not exceed 500 characters"
    )
    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceUpdateRequest()
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
        this.attendanceStatus =
                normalize(attendanceStatus);
    }


    public String getLeaveReason()
    {
        return leaveReason;
    }

    public void setLeaveReason(
            String leaveReason
    )
    {
        this.leaveReason =
                normalize(leaveReason);
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks =
                normalize(remarks);
    }


    // ============================================================
    // NORMALIZATION
    // ============================================================

    private String normalize(String value)
    {
        if (value == null)
        {
            return null;
        }

        String trimmedValue =
                value.trim();

        return trimmedValue.isEmpty()
                ? null
                : trimmedValue;
    }
}


/*
package com.skcp.dto.request.attendance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class AttendanceUpdateRequest
{

    // ============================================================
    // LABOUR ID
    // ============================================================

    @NotNull(message = "Labour ID is required")
    private Integer labourId;


    // ============================================================
    // ATTENDANCE DATE
    // ============================================================

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;


    // ============================================================
    // ATTENDANCE STATUS
    // ============================================================

    @NotBlank(message = "Attendance status is required")
    @Pattern(
            regexp = "PRESENT|ABSENT|LEAVE",
            message = "Attendance status must be PRESENT, ABSENT or LEAVE"
    )
    private String attendanceStatus;


    // ============================================================
    // LEAVE REASON
    // ============================================================

    @Size(
            max = 100,
            message = "Leave reason must not exceed 100 characters"
    )
    private String leaveReason;


    // ============================================================
    // REMARKS
    // ============================================================

    @Size(
            max = 500,
            message = "Remarks must not exceed 500 characters"
    )
    private String remarks;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceUpdateRequest()
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
        this.attendanceStatus =
                normalize(attendanceStatus);
    }


    public String getLeaveReason()
    {
        return leaveReason;
    }

    public void setLeaveReason(String leaveReason)
    {
        this.leaveReason = normalize(leaveReason);
    }


    public String getRemarks()
    {
        return remarks;
    }

    public void setRemarks(String remarks)
    {
        this.remarks = normalize(remarks);
    }


    // ============================================================
    // NORMALIZATION
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

*/