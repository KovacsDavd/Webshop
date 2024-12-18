package hu.backend.controller;

import hu.backend.dto.ProductDTO;
import hu.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class ProductController {
    private final ProductService productService;

    @PostMapping("/product")
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart("image") MultipartFile imageFile) {
        return new ResponseEntity<>(productService.createProduct(productDTO, imageFile), HttpStatus.OK);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(value = "category", required = false) String categoryName,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice) {
        return new ResponseEntity<>(productService.findProducts(categoryName, minPrice, maxPrice), HttpStatus.OK);
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable final Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable final Long id) {
        return ResponseEntity.ok(productService.findProductById(id));
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable final Long id,
            @RequestPart("product") final ProductDTO productDTO,
            @RequestPart(value = "image", required = false) final MultipartFile imageFile) {
        return new ResponseEntity<>(productService.updateProduct(id, productDTO, imageFile), HttpStatus.OK);
    }
}
