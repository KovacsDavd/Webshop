import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Image } from "react-bootstrap";
import ApiService from "../../Service/ApiService.js";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [cartResponse, setCartResponse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await ApiService.getOrCreateCart();
                setCartItems(response.cartItems);
                setTotalAmount(response.totalAmount);
            } catch (error) {
                console.error("Hiba a kosár betöltésekor:", error);
            }
        };

        fetchCart();
    }, []);

    const handleIncrease = async (item) => {
        if (item.quantity < item.product.stockQuantity) {
            const updatedCartItems = cartItems.map((cartItem) =>
                cartItem.product.id === item.product.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            setCartItems(updatedCartItems);
            const response = await ApiService.updateCartItem(item.product.id, item.quantity + 1);
            setTotalAmount(response.totalAmount);
        }
    };

    const handleDecrease = async (item) => {
        const updatedCartItems = cartItems.map((cartItem) =>
            cartItem.product.id === item.product.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );
        setCartItems(updatedCartItems);
        const response = await ApiService.updateCartItem(item.product.id, item.quantity - 1);
        setTotalAmount(response.totalAmount);
    };

    useEffect(() => {
        if (cartResponse) {
            setTotalAmount(cartResponse.data.totalAmount);
        }
    }, [cartResponse]);

    const handleRemove = async (productId) => {
        try {
            const response = await ApiService.removeCartItem(productId);
            const updatedCartItems = cartItems.filter((item) => item.product.id !== productId);
            setCartItems(updatedCartItems);
            setCartResponse(response);
        } catch (error) {
            console.error("Hiba a termék eltávolítása során:", error);
        }
    };

    const handleCheckout = () => {
        navigate("/checkout", { state: { totalAmount } });
    };

    return (
        <Container className="cart-page">
            <Row>
                <Col md={8} className="cart-items-section">
                    <h2>Kosár</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Kép</th>
                                <th>Termék</th>
                                <th>Egységár</th>
                                <th>Mennyiség</th>
                                <th>Összeg</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product.id}>
                                    <td>
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            thumbnail
                                            style={{ width: "80px" }}
                                        />
                                    </td>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.price} Ft</td>
                                    <td>
                                        <div className="quantity-control">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleDecrease(item)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleIncrease(item)}
                                                disabled={item.quantity >= item.product.stockQuantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td>{item.quantity * item.product.price} Ft</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemove(item.product.id)}
                                        >
                                            Törlés
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={4} className="cart-summary-section">
                    <h3>Összegzés</h3>
                    <div className="summary-details">
                            <p>
                                <strong>Teljes összeg: </strong>
                                {totalAmount} Ft
                            </p>
                        <Button variant="success" size="lg" onClick={handleCheckout} className="w-100" disabled={totalAmount === 0}>
                            Tovább a pénztárhoz
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;
