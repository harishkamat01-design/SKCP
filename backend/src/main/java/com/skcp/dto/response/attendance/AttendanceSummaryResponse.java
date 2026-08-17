/*
This is the important change.
It is now the weekly business summary, exactly as we agreed in the architecture document.
*/

package com.skcp.dto.response.attendance;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AttendanceSummaryResponse
{

    // ============================================================
    // LABOUR
    // ============================================================

    private Integer labourId;

    private String labourName;


    // ============================================================
    // WEEK
    // ============================================================

    private LocalDate weekStartDate;

    private LocalDate weekEndDate;


    // ============================================================
    // ATTENDANCE COUNTS
    // ============================================================

    private long presentDays;

    private long absentDays;

    private long holidayDays;


    // ============================================================
    // DAILY RATE
    // ============================================================

    private BigDecimal dailyRate;


    // ============================================================
    // WEEKLY AMOUNT
    // ============================================================

    private BigDecimal weeklyAmount;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceSummaryResponse()
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

    public void setLabourName(
            String labourName
    )
    {
        this.labourName = labourName;
    }


    public LocalDate getWeekStartDate()
    {
        return weekStartDate;
    }

    public void setWeekStartDate(
            LocalDate weekStartDate
    )
    {
        this.weekStartDate = weekStartDate;
    }


    public LocalDate getWeekEndDate()
    {
        return weekEndDate;
    }

    public void setWeekEndDate(
            LocalDate weekEndDate
    )
    {
        this.weekEndDate = weekEndDate;
    }


    public long getPresentDays()
    {
        return presentDays;
    }

    public void setPresentDays(
            long presentDays
    )
    {
        this.presentDays = presentDays;
    }


    public long getAbsentDays()
    {
        return absentDays;
    }

    public void setAbsentDays(
            long absentDays
    )
    {
        this.absentDays = absentDays;
    }


    public long getHolidayDays()
    {
        return holidayDays;
    }

    public void setHolidayDays(
            long holidayDays
    )
    {
        this.holidayDays = holidayDays;
    }


    public BigDecimal getDailyRate()
    {
        return dailyRate;
    }

    public void setDailyRate(
            BigDecimal dailyRate
    )
    {
        this.dailyRate = dailyRate;
    }


    public BigDecimal getWeeklyAmount()
    {
        return weeklyAmount;
    }

    public void setWeeklyAmount(
            BigDecimal weeklyAmount
    )
    {
        this.weeklyAmount = weeklyAmount;
    }
}








/*
 * Lightweight response DTO used for attendance lists.
 *
 * Detailed attendance information is intentionally excluded.
 *
 * Attendance Entity
 *       ↓
 * AttendanceMapper
 *       ↓
 * AttendanceSummaryResponse
 *       ↓
 * Attendance List
 */

/*
 package com.skcp.dto.response.attendance;
import java.math.BigDecimal;
import java.time.LocalDate;

public class AttendanceSummaryResponse
{

    private Integer attendanceId;

    private Integer labourId;

    private String labourName;

    private LocalDate attendanceDate;

    private String attendanceStatus;

    private BigDecimal dailyAmount;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public AttendanceSummaryResponse()
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


    public BigDecimal getDailyAmount()
    {
        return dailyAmount;
    }

    public void setDailyAmount(BigDecimal dailyAmount)
    {
        this.dailyAmount = dailyAmount;
    }
}


*/