package hu.backend.service;

import hu.backend.dto.ProductDTO;
import hu.backend.entity.Category;
import hu.backend.entity.Product;
import hu.backend.repository.CategoryRepository;
import hu.backend.repository.ProductRepository;
import hu.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AwsS3Service awsS3Service;
    private final MapperUtils mapperUtils;

    public ProductDTO createProduct(final ProductDTO productDTO, MultipartFile imageFile) {
        validateProductFields(productDTO);
        productRepository.findByName(productDTO.getName()).ifPresent(entity -> {
            throw new IllegalArgumentException("Product already exists with name: " + productDTO.getName());
        });

        Category category = categoryRepository.findByName(productDTO.getCategory().getName())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with name: "
                        + productDTO.getCategory().getName()));

        Product product = new Product();
        mapperUtils.productDTOToProduct(productDTO, product);
        product.setCategory(category);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = awsS3Service.saveImageToAwsS3(imageFile);
            product.setImageUrl(imageUrl);
        }

        Product savedProduct = productRepository.save(product);
        return mapperUtils.productToProductDTO(savedProduct);
    }

    public ProductDTO updateProduct(final Long id, final ProductDTO productDTO, MultipartFile imageFile) {
        validateProductFields(productDTO);
        Product originalProduct = productRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Product not found with id " + id)
        );

        productRepository.findByName(productDTO.getName()).ifPresent(entity -> {
            if (!entity.getId().equals(originalProduct.getId())) {
                throw new IllegalArgumentException("Product already exists with name: " + productDTO.getName());
            }
        });

        Category category = categoryRepository.findByName(productDTO.getCategory().getName())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with name: "
                        + productDTO.getCategory().getName()));

        mapperUtils.productDTOToProduct(productDTO, originalProduct);
        originalProduct.setCategory(category);
        if (imageFile != null && !imageFile.isEmpty()) {
            if (originalProduct.getImageUrl() != null) {
                String existingFileName = extractFileNameFromUrl(originalProduct.getImageUrl());
                awsS3Service.deleteImageFromAwsS3(existingFileName);
            }

            String newImageUrl = awsS3Service.saveImageToAwsS3(imageFile);
            originalProduct.setImageUrl(newImageUrl);
        } else {
            originalProduct.setImageUrl(originalProduct.getImageUrl());
        }

        Product savedProduct = productRepository.save(originalProduct);
        return mapperUtils.productToProductDTO(savedProduct);
    }

    private String extractFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public List<ProductDTO> findProducts(String categoryName, Double minPrice, Double maxPrice) {
        List<Product> products = productRepository.findProductsByFilters(categoryName, minPrice, maxPrice);
        return products.stream()
                .map(mapperUtils::productToProductDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findProductById(Long id) {
        return mapperUtils.productToProductDTO(productRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Product not found with id " + id)
        ));
    }

    public void deleteProduct(final Long id) {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Product not found with id " + id)
        );

        if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            String fileName = extractFileNameFromUrl(product.getImageUrl());
            awsS3Service.deleteImageFromAwsS3(fileName);
        }

        productRepository.delete(product);
    }

    private void validateProductFields(ProductDTO productDTO) {
        if (productDTO.getName() == null || productDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Product name is required.");
        }
        if (productDTO.getDescription() == null || productDTO.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Product description is required.");
        }
        if (productDTO.getPrice() == null || productDTO.getPrice() <= 0) {
            throw new IllegalArgumentException("Product price must be greater than 0.");
        }
        if (productDTO.getStockQuantity() == null || productDTO.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative.");
        }
        if (productDTO.getCategory() == null || productDTO.getCategory().getName() == null) {
            throw new IllegalArgumentException("Category is required.");
        }
    }
}
