package com.skcp.service;

import com.skcp.entity.Attendance;
import com.skcp.entity.Labour;
import com.skcp.repository.AttendanceRepository;
import com.skcp.repository.LabourRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final LabourRepository labourRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             LabourRepository labourRepository) {
        this.attendanceRepository = attendanceRepository;
        this.labourRepository = labourRepository;
    }

    // Get all attendance
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get attendance by ID
    public Attendance getAttendanceById(Integer id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    // Save attendance
    public Attendance saveAttendance(Attendance attendance) {

        Labour labour =
                labourRepository.findById(attendance.getLabour().getLabourId())
                        .orElseThrow(() ->
                                new RuntimeException("Labour not found"));

        attendance.setLabour(labour);

        // Automatically copy Labour Daily Rate
        attendance.setDailyRate(labour.getDailyRate());

        // Business Rule
        if ("PRESENT".equalsIgnoreCase(attendance.getAttendanceStatus())) {
            attendance.setDailyAmount(labour.getDailyRate());
        } else {
            attendance.setDailyAmount(BigDecimal.ZERO);
        }

        return attendanceRepository.save(attendance);
    }

    // Delete attendance
    public void deleteAttendance(Integer id) {
        attendanceRepository.deleteById(id);
    }
}