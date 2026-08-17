package com.skcp.entity;

import com.skcp.enums.RecordStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance
{

    // ============================================================
    // PRIMARY KEY
    // ============================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;


    // ============================================================
    // PARENT : LABOUR
    // ============================================================

    /*
     * One Labour can have many Attendance records.
     *
     * Labour
     *    │
     *    └── 1 : N ── Attendance
     */

    @ManyToOne
    @JoinColumn(
            name = "labour_id",
            nullable = false
    )
    private Labour labour;


    // ============================================================
    // ATTENDANCE DATE
    // ============================================================

    @Column(
            name = "attendance_date",
            nullable = false
    )
    private LocalDate attendanceDate;


    // ============================================================
    // ATTENDANCE STATUS
    // ============================================================

    /*
     * This describes WHAT happened on that day.
     *
     * PRESENT
     * ABSENT
     * HOLIDAY
     *
     * This is different from RecordStatus.
     */

    @Column(
            name = "attendance_status",
            nullable = false,
            length = 10
    )
    private String attendanceStatus;


    // ============================================================
    // LEAVE / ABSENCE REASON
    // ============================================================

    @Column(
            name = "leave_reason",
            length = 100
    )
    private String leaveReason;


    // ============================================================
    // DAILY RATE
    // ============================================================

    /*
     * Copied from Labour.dailyRate by backend.
     *
     * Frontend must NOT control this value.
     */

    @Column(
            name = "daily_rate",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal dailyRate;


    // ============================================================
    // DAILY AMOUNT
    // ============================================================

    /*
     * Backend-calculated amount.
     *
     * PRESENT  → dailyRate
     * ABSENT   → 0
     * HOLIDAY  → 0
     *
     * Weekly calculation will SUM this field.
     */

    @Column(
            name = "daily_amount",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal dailyAmount;


    // ============================================================
    // REMARKS
    // ============================================================

    @Column(name = "remarks")
    private String remarks;


    // ============================================================
    // RECORD STATUS
    // ============================================================

    /*
     * SKCP SOFT DELETE STANDARD
     *
     * ACTIVE   → valid business record
     * INACTIVE → logically deleted record
     *
     * INACTIVE records remain in DB.
     * They are excluded from normal GETs and calculations.
     */

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private RecordStatus status;


    // ============================================================
    // AUDIT
    // ============================================================

    @Column(
            name = "created_at",
            updatable = false
    )
    private LocalDateTime createdAt;


    // ============================================================
    // PRE-PERSIST
    // ============================================================

    @PrePersist
    public void prePersist()
    {
        this.createdAt = LocalDateTime.now();

        if (this.status == null)
        {
            this.status = RecordStatus.ACTIVE;
        }
    }


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public Attendance()
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


    public Labour getLabour()
    {
        return labour;
    }

    public void setLabour(Labour labour)
    {
        this.labour = labour;
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

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }
}






/*  below is the before DTO code and above is for the DTO.

package com.skcp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;

    
     //Parent Table Mapping
     //Many Attendance records belong to ONE Labour
     
    @ManyToOne
    @JoinColumn(name = "labour_id", nullable = false)
    private Labour labour;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "attendance_status", nullable = false, length = 10)
    private String attendanceStatus;

    @Column(name = "leave_reason", length = 100)
    private String leaveReason;

    @Column(name = "daily_rate", nullable = false)
    private BigDecimal dailyRate;

    @Column(name = "daily_amount", nullable = false)
    private BigDecimal dailyAmount;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Default Constructor
    public Attendance() 
    {

    }

    // Getters and Setters

    public Integer getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Integer attendanceId) {
        this.attendanceId = attendanceId;
    }

    public Labour getLabour() {
        return labour;
    }

    public void setLabour(Labour labour) {
        this.labour = labour;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public String getLeaveReason() {
        return leaveReason;
    }

    public void setLeaveReason(String leaveReason) {
        this.leaveReason = leaveReason;
    }

    public BigDecimal getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(BigDecimal dailyRate) {
        this.dailyRate = dailyRate;
    }

    public BigDecimal getDailyAmount() {
        return dailyAmount;
    }

    public void setDailyAmount(BigDecimal dailyAmount) {
        this.dailyAmount = dailyAmount;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

*/