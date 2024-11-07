package com.swp.hg.repository;

import com.swp.hg.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Integer> {
    int countSkillCategoriesByStatus(boolean status);
}
