package com.swp.hg.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SlotDTO {
    private int id;
    private String startTime;
    private String endTime;
    private String name;
}
