package hu.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private UserDTO user;
    private String status;
    private String address;
    private String city;
    private String country;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> orderItems;
}
