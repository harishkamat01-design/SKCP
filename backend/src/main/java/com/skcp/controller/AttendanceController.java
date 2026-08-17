/*
Notice the weekly endpoint is before /{id} conceptually, and the URL is:
GET /api/attendance/summary/weekly?labourId=1&weekStartDate=2026-08-10
The backend normalizes the supplied date to Monday. This follows the architecture we froze.
*/

package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.service.AttendanceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController
{

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final AttendanceService attendanceService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public AttendanceController(
            AttendanceService attendanceService
    )
    {
        this.attendanceService =
                attendanceService;
    }


    // ============================================================
    // GET ALL ACTIVE ATTENDANCE
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<AttendanceResponse>>
            > getAllAttendance()
    {

        List<AttendanceResponse> attendanceList =
                attendanceService.getAllAttendance();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance records retrieved successfully",
                        attendanceList
                )
        );
    }


    // ============================================================
    // WEEKLY ATTENDANCE SUMMARY
    // ============================================================

    @GetMapping("/summary/weekly")
    public ResponseEntity<
            ApiResponse<AttendanceSummaryResponse>
            > getWeeklySummary(
            @RequestParam Integer labourId,
            @RequestParam LocalDate weekStartDate
    )
    {

        AttendanceSummaryResponse summary =
                attendanceService.getWeeklySummary(
                        labourId,
                        weekStartDate
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weekly attendance summary retrieved successfully",
                        summary
                )
        );
    }


    // ============================================================
    // GET ACTIVE ATTENDANCE BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > getAttendanceById(
            @PathVariable Integer id
    )
    {

        AttendanceResponse attendance =
                attendanceService.getAttendanceById(
                        id
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance record retrieved successfully",
                        attendance
                )
        );
    }


    // ============================================================
    // CREATE ATTENDANCE
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > createAttendance(
            @Valid
            @RequestBody
            AttendanceCreateRequest request
    )
    {

        AttendanceResponse savedAttendance =
                attendanceService.createAttendance(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Attendance created successfully",
                                savedAttendance
                        )
                );
    }


    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > updateAttendance(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            AttendanceUpdateRequest request
    )
    {

        AttendanceResponse updatedAttendance =
                attendanceService.updateAttendance(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance updated successfully",
                        updatedAttendance
                )
        );
    }


    // ============================================================
    // DELETE ATTENDANCE — SOFT DELETE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteAttendance(
            @PathVariable Integer id
    )
    {

        attendanceService.deleteAttendance(
                id
        );

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Attendance deleted successfully",
                        null
                )
        );
    }
}




/*
package com.skcp.controller;

import com.skcp.common.ApiResponse;
import com.skcp.dto.request.attendance.AttendanceCreateRequest;
import com.skcp.dto.request.attendance.AttendanceUpdateRequest;
import com.skcp.dto.response.attendance.AttendanceResponse;
import com.skcp.dto.response.attendance.AttendanceSummaryResponse;
import com.skcp.service.AttendanceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController
{

    // ============================================================
    // DEPENDENCY
    // ============================================================

    private final AttendanceService attendanceService;


    // ============================================================
    // CONSTRUCTOR INJECTION
    // ============================================================

    public AttendanceController(
            AttendanceService attendanceService
    )
    {
        this.attendanceService =
                attendanceService;
    }


    // ============================================================
    // GET ALL ATTENDANCE
    // ============================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<AttendanceSummaryResponse>>
            > getAllAttendance()
    {

        List<AttendanceSummaryResponse> attendanceList =
                attendanceService.getAllAttendance();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance records retrieved successfully",
                        attendanceList
                )
        );
    }


    // ============================================================
    // GET ATTENDANCE BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > getAttendanceById(
            @PathVariable Integer id
    )
    {

        AttendanceResponse attendance =
                attendanceService.getAttendanceById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance record retrieved successfully",
                        attendance
                )
        );
    }


    // ============================================================
    // CREATE ATTENDANCE
    // ============================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > createAttendance(
            @Valid @RequestBody AttendanceCreateRequest request
    )
    {

        AttendanceResponse savedAttendance =
                attendanceService.createAttendance(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Attendance created successfully",
                                savedAttendance
                        )
                );
    }


    // ============================================================
    // UPDATE ATTENDANCE
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<AttendanceResponse>
            > updateAttendance(
            @PathVariable Integer id,
            @Valid @RequestBody AttendanceUpdateRequest request
    )
    {

        AttendanceResponse updatedAttendance =
                attendanceService.updateAttendance(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Attendance updated successfully",
                        updatedAttendance
                )
        );
    }


    // ============================================================
    // DELETE ATTENDANCE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            > deleteAttendance(
            @PathVariable Integer id
    )
    {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>success(
                        "Attendance deleted successfully",
                        null
                )
        );
    }
}


*/

/*
package com.skcp.controller;

import com.skcp.entity.Attendance;
import com.skcp.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    // Dependency Injection
    private final AttendanceService attendanceService;

    // Constructor Injection
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Get all attendance records
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        List<Attendance> attendanceList = attendanceService.getAllAttendance();

        return ResponseEntity.ok(attendanceList);
    }

    // Get attendance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Integer id) {

        Attendance attendance = attendanceService.getAttendanceById(id);

        if (attendance == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(attendance);
    }

    // Create attendance
    @PostMapping
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {

        Attendance savedAttendance = attendanceService.saveAttendance(attendance);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAttendance);
    }

    // Update attendance
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Integer id,
            @RequestBody Attendance attendance) {

        Attendance existingAttendance = attendanceService.getAttendanceById(id);

        if (existingAttendance == null) {
            return ResponseEntity.notFound().build();
        }

        // Update editable fields
        existingAttendance.setLabour(attendance.getLabour());
        existingAttendance.setAttendanceDate(attendance.getAttendanceDate());
        existingAttendance.setAttendanceStatus(attendance.getAttendanceStatus());
        
        existingAttendance.setDailyAmount(attendance.getDailyAmount());
        existingAttendance.setRemarks(attendance.getRemarks());

        Attendance updatedAttendance =
                attendanceService.saveAttendance(existingAttendance);

        return ResponseEntity.ok(updatedAttendance);
    }

    // Delete attendance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Integer id) {

        Attendance existingAttendance = attendanceService.getAttendanceById(id);

        if (existingAttendance == null) {
            return ResponseEntity.notFound().build();
        }

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
}

*/