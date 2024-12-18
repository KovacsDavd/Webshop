package hu.backend.service;

import hu.backend.dto.CategoryDTO;
import hu.backend.entity.Category;
import hu.backend.repository.CategoryRepository;
import hu.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final MapperUtils mapperUtils;

    public CategoryDTO createCategory(final CategoryDTO categoryDTO) {
        validateCategoryFields(categoryDTO);
        categoryRepository.findByName(categoryDTO.getName()).ifPresent(entity -> {
            throw new IllegalArgumentException("Category already exists");
        });

        Category category = mapperUtils.categoryDTOToCategory(categoryDTO, new Category());
        Category savedCategory = categoryRepository.save(category);

        return mapperUtils.categoryToCategoryDTO(savedCategory);
    }

    public List<CategoryDTO> getAllCategories() {
        final List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(mapperUtils::categoryToCategoryDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO findCategoryById(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Category not found with id " + id)
        );
        return mapperUtils.categoryToCategoryDTO(category);
    }

    public CategoryDTO updateCategory(final Long id, final CategoryDTO categoryDTO) {
        validateCategoryFields(categoryDTO);
        Category updateCategory = categoryRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Category not found with id " + id)
        );
        mapperUtils.categoryDTOToCategory(categoryDTO, updateCategory);

        Category savedCategory = categoryRepository.save(updateCategory);
        return mapperUtils.categoryToCategoryDTO(savedCategory);
    }

    public void deleteCategory(final Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Category not found with id " + id)
        );
        try {
            categoryRepository.delete(category);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Cannot delete category with id " + id + " because it is linked to products.", ex);
        }
    }


    private void validateCategoryFields(CategoryDTO categoryDTO) {
        if (categoryDTO.getName() == null || categoryDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Category name is required.");
        }
    }
}
