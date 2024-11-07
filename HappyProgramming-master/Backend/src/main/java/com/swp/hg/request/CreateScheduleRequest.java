package com.swp.hg.request;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class CreateScheduleRequest {

    private int mentorId;
    private int skillId;
    private int slotId;
    private String date;
}
