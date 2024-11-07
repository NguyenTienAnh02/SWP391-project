package com.swp.hg.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class MentorSkillDTO {
    private int id;
    private int yearOfExp;
    private String desc;
    private int skillId;
    private String skillName;
}
