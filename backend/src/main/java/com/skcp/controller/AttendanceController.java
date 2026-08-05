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