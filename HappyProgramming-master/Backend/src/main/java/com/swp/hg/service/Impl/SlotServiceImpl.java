package com.swp.hg.service.Impl;

import com.swp.hg.dto.SlotDTO;
import com.swp.hg.entity.Slot;
import com.swp.hg.mapper.SlotMapper;
import com.swp.hg.repository.SlotRepository;
import com.swp.hg.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlotServiceImpl implements SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private SlotMapper slotMapper;

    @Override
    public List<SlotDTO> getAll() {
        List<Slot> slots = slotRepository.findAll();

        return slots.stream()
                .map(slot -> slotMapper.convertToDTO(slot))
                .collect(Collectors.toList());
    }
}
