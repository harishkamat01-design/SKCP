package com.skcp.repository;

import com.skcp.entity.Attendance;
import com.skcp.enums.RecordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Integer>
{

    // ============================================================
    // GET ALL ACTIVE ATTENDANCE
    // ============================================================

    List<Attendance> findByStatus(
            RecordStatus status
    );


    // ============================================================
    // GET ACTIVE ATTENDANCE BY ID
    // ============================================================

    Optional<Attendance> findByAttendanceIdAndStatus(
            Integer attendanceId,
            RecordStatus status
    );


    // ============================================================
    // CHECK DUPLICATE ATTENDANCE
    // ============================================================

    Optional<Attendance>
    findByLabourLabourIdAndAttendanceDateAndStatus(
            Integer labourId,
            LocalDate attendanceDate,
            RecordStatus status
    );


    // ============================================================
    // CHECK DUPLICATE DURING UPDATE
    // ============================================================

    Optional<Attendance>
    findByLabourLabourIdAndAttendanceDateAndAttendanceIdNotAndStatus(
            Integer labourId,
            LocalDate attendanceDate,
            Integer attendanceId,
            RecordStatus status
    );


    // ============================================================
    // WEEKLY ACTIVE ATTENDANCE
    // ============================================================

    List<Attendance>
    findByLabourLabourIdAndAttendanceDateBetweenAndStatus(
            Integer labourId,
            LocalDate weekStartDate,
            LocalDate weekEndDate,
            RecordStatus status
    );
}




/*
package com.skcp.repository;

import com.skcp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Integer>
{

    // ============================================================
    // CHECK DUPLICATE ATTENDANCE
    // ============================================================

    Optional<Attendance> findByLabourLabourIdAndAttendanceDate(
            Integer labourId,
            LocalDate attendanceDate
    );


    // ============================================================
    // CHECK DUPLICATE ATTENDANCE DURING UPDATE
    // ============================================================

    Optional<Attendance> findByLabourLabourIdAndAttendanceDateAndAttendanceIdNot(
            Integer labourId,
            LocalDate attendanceDate,
            Integer attendanceId
    );
}

*/

/*
package com.skcp.repository;

import com.skcp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer>
{

}




*/