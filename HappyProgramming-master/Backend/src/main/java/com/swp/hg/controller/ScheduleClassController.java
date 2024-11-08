package com.swp.hg.controller;

import com.swp.hg.dto.ScheduleClassDTO;
import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.request.UpdateScheduleClassReq;
import com.swp.hg.service.ScheduleClassService;
import com.swp.hg.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule_class")
@CrossOrigin
public class ScheduleClassController {

    @Autowired
    private ScheduleClassService scheduleClassService;

    @GetMapping("/{id}")
    public ResponseEntity<List<ScheduleClassDTO>> index(@PathVariable int id) {
        try {
            List<ScheduleClassDTO> schedules = scheduleClassService.findAllByScheduleId(id);
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-multiple")
    public ResponseEntity<?> updateMultiple(@RequestBody UpdateScheduleClassReq request) {
        try {
            List<ScheduleClassDTO> updatedScheduleClasses = scheduleClassService.updateScheduleClasses(request.getScheduleClassUpdates(), request.getScheduleId());
            return new ResponseEntity<>(updatedScheduleClasses, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}
