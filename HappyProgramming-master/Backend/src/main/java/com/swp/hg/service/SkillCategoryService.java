package com.swp.hg.service;

import com.swp.hg.dto.MentorSkillDTO;
import com.swp.hg.dto.ResultDTO;
import com.swp.hg.dto.SkillCategoryDTO;
import com.swp.hg.entity.MentorSkill;
import com.swp.hg.entity.SkillCategory;

import java.util.List;

public interface SkillCategoryService {
    List<SkillCategory> getAll();
    List<MentorSkillDTO> getSkillsByMentor(int mentorId);
    SkillCategory getById(int id);
    ResultDTO<SkillCategory> saveOrUpdate(SkillCategoryDTO skillCategoryDTO);
    ResultDTO<SkillCategory> delete(int id);
    int getTotalSkills();
    int getTotalSkillByStatus(boolean status);
}
