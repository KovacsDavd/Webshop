package hu.backend.controller;

import hu.backend.dto.OrderDTO;
import hu.backend.entity.User;
import hu.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<OrderDTO> createOrder(@AuthenticationPrincipal User user, @RequestBody OrderDTO orderRequest) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        OrderDTO createdOrder = orderService.createOrder(user, orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }

    @GetMapping("/orders/user")
    public ResponseEntity<List<OrderDTO>> getAllOrdersByUser(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(orderService.getAllOrdersByUser(user), HttpStatus.OK);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable final Long id) {
        return new ResponseEntity<>(orderService.getOrderById(id), HttpStatus.OK);
    }

    @PutMapping("/order/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable final Long id, @RequestBody OrderDTO orderDTO) {
        return new ResponseEntity<>(orderService.updateOrder(id, orderDTO), HttpStatus.OK);
    }

    @DeleteMapping("/order/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable final Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted successfully");
    }
}
