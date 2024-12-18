import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import ApiService from "../../Service/ApiService";
import "./CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { state } = useLocation();
    const totalAmount = state.totalAmount;
    const navigate = useNavigate();

    const handleOrderSubmit = async (event) => {
        event.preventDefault();

        if (!address || !city || !country) {
            setErrorMessage("Kérjük, töltsd ki az összes mezőt!");
            return;
        }

        const orderRequest = {
            address,
            city,
            country,
            totalAmount,
        };

        try {
            await ApiService.createOrder(orderRequest);
            setSuccessMessage("Rendelés sikeresen leadva!");
            setErrorMessage(null);
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (error) {
            console.error("Hiba a rendelés során:", error);
            setErrorMessage("Hiba történt a rendelés leadása során. Kérjük, próbáld újra.");
        }
    };

    return (
        <Container className="checkout-page">
            <Row>
                <Col md={6} className="checkout-form-section">
                    <h2>Szállítási adatok</h2>
                    <Form onSubmit={handleOrderSubmit}>
                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Cím</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Írd be a címed"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="city" className="mb-3">
                            <Form.Label>Város</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Írd be a várost"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="country" className="mb-3">
                            <Form.Label>Ország</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Írd be az országot"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Rendelés leadása
                        </Button>
                    </Form>
                    {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                </Col>

                <Col md={6} className="order-summary-section">
                    <h2>Rendelés összegzése</h2>
                    <div className="order-details">
                        <p>
                            <strong>Teljes összeg: </strong>
                            {totalAmount} Ft
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
