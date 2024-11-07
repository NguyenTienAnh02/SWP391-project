package com.swp.hg.mapper;

import com.swp.hg.dto.ScheduleDTO;
import com.swp.hg.dto.SlotDTO;
import com.swp.hg.entity.Schedule;
import com.swp.hg.entity.Slot;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Service
@Getter
public class SlotMapper {
    public SlotDTO convertToDTO(Slot slot) {
        SlotDTO dto = new SlotDTO();
        dto.setId(slot.getId());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setName(slot.getName());
        return dto;
    }
}