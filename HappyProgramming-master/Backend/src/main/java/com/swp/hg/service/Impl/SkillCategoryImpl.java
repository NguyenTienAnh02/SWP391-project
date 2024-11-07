package com.swp.hg.service.Impl;

import com.swp.hg.dto.MentorSkillDTO;
import com.swp.hg.dto.ResultDTO;
import com.swp.hg.dto.SkillCategoryDTO;
import com.swp.hg.entity.MentorSkill;
import com.swp.hg.entity.SkillCategory;
import com.swp.hg.mapper.MentorSkillMapper;
import com.swp.hg.repository.MentorSkillRepository;
import com.swp.hg.repository.SkillCategoryRepository;
import com.swp.hg.service.SkillCategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillCategoryImpl implements SkillCategoryService {

    private final SkillCategoryRepository skillCategoryRepository;
    private final MentorSkillRepository mentorSkillRepository;
    private final MentorSkillMapper mentorSkillMapper;

    public SkillCategoryImpl(SkillCategoryRepository skillCategoryRepository, MentorSkillRepository mentorSkillRepository, MentorSkillMapper mentorSkillMapper) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.mentorSkillRepository = mentorSkillRepository;
        this.mentorSkillMapper = mentorSkillMapper;
    }

    @Override
    public List<SkillCategory> getAll() {
        return skillCategoryRepository.findAll();
    }

    @Override
    public List<MentorSkillDTO> getSkillsByMentor(int mentorId) {
        List<MentorSkill> mentorSkills =  mentorSkillRepository.findMentorSkillsByMentorProfile_MentorID(mentorId);
        return mentorSkills.stream()
                .map(mentorSkill -> mentorSkillMapper.convertToDTO(mentorSkill))
                .collect(Collectors.toList());
    }

    @Override
    public SkillCategory getById(int id) {
        return skillCategoryRepository.findById(id).orElse(null);
    }

    @Override
    public ResultDTO<SkillCategory> saveOrUpdate(SkillCategoryDTO skillCategoryDTO) {
        ResultDTO<SkillCategory> resultDTO = new ResultDTO<>();
        try {
            SkillCategory skillCategory = getById(skillCategoryDTO.getSkillID());
            System.out.println(skillCategory);
            if (skillCategory == null) {
                skillCategory = new SkillCategory();
                skillCategory.setSkillName(skillCategoryDTO.getSkillName());
                skillCategory.setStatus(skillCategoryDTO.isStatus());
                resultDTO.setStatus(true);
                resultDTO.setData(skillCategory);
                resultDTO.setMessage("Saved Successfully");
            } else {
                skillCategory.setSkillName(skillCategoryDTO.getSkillName());
                skillCategory.setStatus(skillCategoryDTO.isStatus());
                resultDTO.setStatus(true);
                resultDTO.setData(skillCategory);
                resultDTO.setMessage("Updated Successfully");
            }
            skillCategoryRepository.save(skillCategory);
        } catch (Exception e) {
            resultDTO.setStatus(false);
            resultDTO.setMessage(e.getMessage());
        }
        return resultDTO;
    }

    @Override
    public ResultDTO<SkillCategory> delete(int id) {
        ResultDTO<SkillCategory> resultDTO = new ResultDTO<>();
        SkillCategory skillCategory = getById(id);
        if (skillCategory != null) {
            skillCategoryRepository.deleteById(id);
            resultDTO.setStatus(true);
            resultDTO.setData(getById(id));
            resultDTO.setMessage("Deleted Successfully");
        } else {
            resultDTO.setStatus(false);
            resultDTO.setMessage("Skill Category Not Found");
        }
        return resultDTO;
    }

    @Override
    public int getTotalSkills() {
        return skillCategoryRepository.findAll().size();
    }

    @Override
    public int getTotalSkillByStatus(boolean status) {
        return skillCategoryRepository.countSkillCategoriesByStatus(status);
    }


}
