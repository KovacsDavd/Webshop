package hu.backend.service;

import hu.backend.dto.OrderDTO;
import hu.backend.entity.*;
import hu.backend.repository.CartRepository;
import hu.backend.repository.OrderRepository;
import hu.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final MapperUtils mapperUtils;

    @Transactional
    public OrderDTO createOrder(User user, OrderDTO orderRequest) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("The cart is empty, you cannot place an order");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("in progress");
        order.setAddress(orderRequest.getAddress());
        order.setCity(orderRequest.getCity());
        order.setCountry(orderRequest.getCountry());
        order.setTotalAmount(cart.getTotalAmount());

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItem.setOrder(order);

            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        orderRepository.save(order);

        cart.getCartItems().clear();
        cart.setTotalAmount(0.0);
        cartRepository.save(cart);

        return mapperUtils.orderToOrderDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(mapperUtils::orderToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrdersByUser(final User user) {
        return orderRepository.findAllByUser(user).stream()
                .map(mapperUtils::orderToOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(final Long id) {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Order not found with id " + id)
        );
        return mapperUtils.orderToOrderDTO(order);
    }

    public OrderDTO updateOrder(final Long id, final OrderDTO orderDTO) {
        if (orderDTO.getStatus() == null) {
            throw new IllegalArgumentException("Order status is null");
        }

        Order order = orderRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Order not found with id " + id)
        );

        order.setStatus(orderDTO.getStatus());
        Order updatedOrder = orderRepository.save(order);
        return mapperUtils.orderToOrderDTO(updatedOrder);
    }

    public void deleteOrder(final Long id) {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Order not found with id " + id)
        );
        orderRepository.delete(order);
    }
}
