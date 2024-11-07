package com.swp.hg.repository;

import com.swp.hg.entity.MentorProfile;
import com.swp.hg.entity.MentorSkill;
import com.swp.hg.entity.SkillCategory;
import com.swp.hg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorSkillRepository extends JpaRepository<MentorSkill, Integer> {
    void deleteByMentorProfile(MentorProfile mentorProfile);
    boolean existsMentorSkillByMentorProfile_MentorProfileAndSkillCategory(User user, SkillCategory skill);
    List<MentorSkill> findMentorSkillsByMentorProfile_MentorID(int mentorId);
}
