package hu.backend.controller;

import hu.backend.dto.CartDTO;
import hu.backend.entity.User;
import hu.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/cart")
    public ResponseEntity<CartDTO> getOrCreateCart(@AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(cartService.getOrCreateCart(user), HttpStatus.OK);
    }

    @PostMapping("/cart/item/{productId}")
    public ResponseEntity<CartDTO> addItemToCart(@AuthenticationPrincipal User user,
                                                 @PathVariable Long productId,
                                                 @RequestParam Integer quantity) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(cartService.addItemToCart(user, productId, quantity), HttpStatus.OK);
    }

    @DeleteMapping("/cart/item/{itemId}")
    public ResponseEntity<CartDTO> removeItemFromCart(@AuthenticationPrincipal User user, @PathVariable Long itemId) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        CartDTO cartDTO = cartService.removeItemFromCart(user, itemId);
        return ResponseEntity.ok(cartDTO);
    }

    @PutMapping("/cart/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItemQuantity(@AuthenticationPrincipal User user, @PathVariable Long itemId, @RequestParam Integer quantity) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        CartDTO cartDTO = cartService.updateCartItemQuantity(user, itemId, quantity);
        return ResponseEntity.ok(cartDTO);
    }

    @DeleteMapping("/cart")
    public ResponseEntity<String> clearCart(@AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
