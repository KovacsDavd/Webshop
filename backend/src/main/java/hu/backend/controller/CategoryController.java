package hu.backend.controller;

import hu.backend.dto.CategoryDTO;
import hu.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/category")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody final CategoryDTO category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable final Long id) {
        return ResponseEntity.ok(categoryService.findCategoryById(id));
    }

    @DeleteMapping("category/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable final Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable final Long id, @RequestBody final CategoryDTO Category) {
        return new ResponseEntity<>(categoryService.updateCategory(id, Category), HttpStatus.OK);
    }
}
