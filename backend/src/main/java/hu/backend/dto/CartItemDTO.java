package hu.backend.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private Long cartId;
    private ProductDTO product;
    private Integer quantity;
}
