import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useContext } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ApiService from '../Service/ApiService.js';
import AuthContext from '../Service/AuthContext.js';

const Login = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

    const handleToggleForm = () => {
        setIsRegistering(!isRegistering);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await ApiService.signUp(formData);
                setToastMessage("Sikeres regisztráció! Jelentkezz be.");
                setIsRegistering(false);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: ""
                });
                setShowToast(true);
                setTimeout(() => setIsRegistering(false), 2000);
            } else {
                await ApiService.login(formData.email, formData.password);
                window.location.href = '/';
            }
        } catch (error) {
            let errorMessage = "Ismeretlen hiba történt.";
            if (error.response) {
                if (error.response.data.includes("User already exists")) {
                    errorMessage = "Már van ilyen fiók.";
                } else if (error.response.data.includes("Wrong email or password")) {
                    errorMessage = "Rossz email és jelszó párosítás";
                }
            }
            setToastMessage(errorMessage);
            setShowToast(true);
        }
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Row>
                    <Col>
                        <Card className="shadow p-4 w-100">
                            <Card.Body>
                                <h3 className="text-center mb-4">
                                    {isLoggedIn === null
                                        ? null
                                        : isLoggedIn
                                            ? "Már be vagy lépve"
                                            : isRegistering
                                                ? "Regisztráció"
                                                : "Bejelentkezés"}
                                </h3>

                                {isLoggedIn === false && (
                                    !isRegistering ? (
                                        <>
                                            <Form onSubmit={handleFormSubmit}>
                                                <Form.Group as={Row} className="mb-3" controlId="loginEmail">
                                                    <Form.Label column sm={3}>
                                                        Email:
                                                    </Form.Label>
                                                    <Col sm={9}>
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
                                                <Form.Group as={Row} className="mb-3" controlId="loginPassword">
                                                    <Form.Label column sm={3}>
                                                        Jelszó:
                                                    </Form.Label>
                                                    <Col sm={9}>
                                                        <Form.Control
                                                            type="password"
                                                            name="password"
                                                            placeholder="Jelszó"
                                                            required
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Button type="submit" variant="primary" className="w-100 mb-3">
                                                    Bejelentkezés
                                                </Button>
                                            </Form>
                                            <p className="text-center">
                                                Nincs még fiókod?
                                                <br />
                                                <Button
                                                    variant="link"
                                                    className="p-0"
                                                    onClick={handleToggleForm}
                                                >
                                                    Regisztráció
                                                </Button>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Form onSubmit={handleFormSubmit}>
                                                <Form.Group as={Row} className="mb-3" controlId="lastName">
                                                    <Form.Label column sm={4}>
                                                        Keresztnév:
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Keresztnév"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3" controlId="firstName">
                                                    <Form.Label column sm={4}>
                                                        Vezetéknév:
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Vezetéknév"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3" controlId="registerEmail">
                                                    <Form.Label column sm={4}>
                                                        Email:
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3" controlId="registerPassword">
                                                    <Form.Label column sm={4}>
                                                        Jelszó:
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder="Jelszó"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Button type='submit' variant="primary" className="w-100 mb-3">
                                                    Regisztráció
                                                </Button>
                                            </Form>
                                            <p className="text-center">
                                                Van már fiókod?
                                                <br />
                                                <Button
                                                    variant="link"
                                                    className="p-0"
                                                    onClick={handleToggleForm}
                                                >
                                                    Bejelentkezés
                                                </Button>
                                            </p>
                                        </>
                                    )
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <ToastContainer position='top-center' className='mt-5'>
                <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={2000}>
                    <Toast.Header>
                        <strong className='me-auto'>Hiba!</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default Login;
