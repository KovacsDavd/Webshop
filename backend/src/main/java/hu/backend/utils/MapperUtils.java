package hu.backend.utils;

import hu.backend.dto.*;
import hu.backend.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MapperUtils {
    UserDTO userToUserDTO(User user);

    @Mapping(target = "id", ignore = true)
    User userDTOToUser(UserDTO userDTO, @MappingTarget User user);

    @Mapping(target = "cartItems", source = "cartItems")
    @Mapping(target = "user", source = "user")
    CartDTO cartToCartDTO(Cart cart);

    @Mapping(target = "id", ignore = true)
    Cart cartDTOToCart(CartDTO cartDTO, @MappingTarget Cart cart);

    @Mapping(target = "cartId", source = "cart.id")
    CartItemDTO cartItemToCartItemDTO(CartItem cartItem);

    @Mapping(target = "cart", source = "cartId")
    CartItem cartItemDTOToCartItem(CartItemDTO cartItemDTO, @MappingTarget CartItem cartItem);

    default Cart map(Long cartId) {
        Cart cart = new Cart();
        cart.setId(cartId);
        return cart;
    }

    CategoryDTO categoryToCategoryDTO(Category category);

    Category categoryDTOToCategory(CategoryDTO categoryDTO, @MappingTarget Category category);

    OrderDTO orderToOrderDTO(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Order orderDTOToOrder(OrderDTO orderDTO, @MappingTarget Order order);

    @Mapping(source = "order.id", target = "orderId")
    OrderItemDTO orderItemToOrderItemDTO(OrderItem orderItem);

    @Mapping(source = "orderId", target = "order.id")
    OrderItem orderItemDTOToOrderItem(OrderItemDTO orderItemDTO, @MappingTarget OrderItem orderItem);

    @Mapping(source = "product.category", target = "category")
    ProductDTO productToProductDTO(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "category", ignore = true)
    Product productDTOToProduct(ProductDTO productDTO, @MappingTarget Product product);
}