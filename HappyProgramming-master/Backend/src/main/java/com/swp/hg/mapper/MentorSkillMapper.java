package com.swp.hg.mapper;

import com.swp.hg.dto.MentorSkillDTO;
import com.swp.hg.entity.MentorSkill;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Service
@Getter
public class MentorSkillMapper {
    public MentorSkillDTO convertToDTO(MentorSkill mentorSkill) {
        MentorSkillDTO dto = new MentorSkillDTO();
        dto.setId(mentorSkill.getMentorSkillID());
        dto.setYearOfExp(mentorSkill.getYearsOfExp());
        dto.setDesc(mentorSkill.getDescription());
        dto.setSkillId(mentorSkill.getSkillCategory().getSkillID());
        dto.setSkillName(mentorSkill.getSkillCategory().getSkillName());
        return dto;
    }
}
