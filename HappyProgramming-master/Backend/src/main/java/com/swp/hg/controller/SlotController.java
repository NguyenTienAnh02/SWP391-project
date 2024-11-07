package com.swp.hg.controller;

import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.dto.SlotDTO;
import com.swp.hg.service.ScheduleService;
import com.swp.hg.service.SlotService;
import com.swp.hg.util.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slot")
@CrossOrigin
public class SlotController {

    @Autowired
    private SlotService slotService;

    @GetMapping()
    public ResponseEntity<List<SlotDTO>> index() {
        try {
            List<SlotDTO> slots = slotService.getAll();
            return new ResponseEntity<>(slots, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

}
