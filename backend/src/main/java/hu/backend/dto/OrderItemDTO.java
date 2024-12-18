package hu.backend.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private ProductDTO product;
    private Integer quantity;
    private Double price;
}
