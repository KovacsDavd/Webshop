package hu.backend.service;

import hu.backend.dto.CartDTO;
import hu.backend.entity.Cart;
import hu.backend.entity.CartItem;
import hu.backend.entity.Product;
import hu.backend.entity.User;
import hu.backend.repository.CartItemRepository;
import hu.backend.repository.CartRepository;
import hu.backend.repository.ProductRepository;
import hu.backend.repository.UserRepository;
import hu.backend.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final MapperUtils mapperUtils;

    @Transactional
    public CartDTO getOrCreateCart(User user) {
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        return mapperUtils.cartToCartDTO(cart);
    }

    @Transactional
    public CartDTO removeItemFromCart(User user, Long itemId) {
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(user.getId(), itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        Cart cart = cartItem.getCart();
        if (cart == null) {
            throw new IllegalArgumentException("Cart not found");
        }
        cart.getCartItems().remove(cartItem);
        calculateTotalAmount(cart);

        return getOrCreateCart(user);
    }

    @Transactional
    public CartDTO addItemToCart(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct().getId().equals(product.getId()))
                .findFirst();
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cart.getCartItems().add(cartItem);
        }
        calculateTotalAmount(cart);

        return getOrCreateCart(user);
    }

    @Transactional
    public CartDTO updateCartItemQuantity(User user, Long itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(user.getId(), itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        Cart cart = cartItem.getCart();
        calculateTotalAmount(cart);

        return getOrCreateCart(user);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private void calculateTotalAmount(Cart cart) {
        double totalAmount = 0.0;

        for (CartItem cartItem : cart.getCartItems()) {
            totalAmount += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }

        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }
}
