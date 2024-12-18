import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService.js';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const UpdateUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        role: ""
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.getUser(id);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching user: ", error.message);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.updateUser(id, formData);
            navigate("/admin/users", { state: { success: true, action: "edit" } });
        } catch (error) {
            console.error("Error in update: ", error.message);
            setToastMessage("Hiba történt a felhasználó frissítésekor.");
            setShowToast(true);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Row>
                    <Col md={12}>
                        <Card className="shadow p-4 w-100">
                            <Card.Body>
                                <h3 className="text-center mb-4">Felhasználó Szerkesztése</h3>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicLastName">
                                        <Form.Label column sm={4}>
                                            Vezetéknév:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                placeholder="Vezetéknév"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" controlId="formBasicFirstName">
                                        <Form.Label column sm={4}>
                                            Keresztnév:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                placeholder="Keresztnév"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>
                                            Email:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-4" controlId="formBasicRole">
                                        <Form.Label column sm={4}>
                                            Szerepkör:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Válassz szerepkört</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="USER">USER</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="w-100">
                                        Mentés
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <ToastContainer position="top-center" className="mt-5">
                <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={2000}>
                    <Toast.Header>
                        <strong className="me-auto">Hiba!</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default UpdateUser;
