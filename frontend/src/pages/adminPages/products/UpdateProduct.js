import { useEffect, useState } from 'react';
import { Button, Container, Form, Col, Row, Card, Toast, ToastContainer } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService';

const UpdateProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
        category: {},
    });

    const [categories, setCategories] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const response = await ApiService.getProduct(id);
                    setFormData({
                        ...response.data,
                        category: response.data.category,
                    });
                } catch (error) {
                    console.error("Error fetching product:", error);
                    setToastMessage("Hiba történt a termék betöltésekor.");
                    setShowToast(true);
                }
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await ApiService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find((category) => category.id === parseInt(e.target.value));
        setFormData({ ...formData, category: selectedCategory });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("product", new Blob([JSON.stringify(formData)], { type: "application/json" }));

            if (id) {
                await ApiService.updateProduct(id, formDataToSend);
                navigate("/admin/products", { state: { success: true, action: "edit" } });
            } else {
                await ApiService.addProduct(formDataToSend);
                navigate("/admin/products", { state: { success: true, action: "add" } });
            }

        } catch (error) {
            console.error("Error saving product:", error.response?.data || error.message);
            setToastMessage("Hiba történt a termék mentésekor.");
            setShowToast(true);
        }
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Row>
                    <Col md={12}>
                        <Card className="shadow p-4 w-100">
                            <Card.Body>
                                <h3 className="text-center mb-4">{id ? "Termék Szerkesztése" : "Új Termék Hozzáadása"}</h3>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group as={Row} className="mb-3" controlId="formProductName">
                                        <Form.Label column sm={4}>
                                            Név:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Termék neve"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
    
                                    <Form.Group as={Row} className="mb-3" controlId="formProductDescription">
                                        <Form.Label column sm={4}>
                                            Leírás:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="description"
                                                placeholder="Termék leírása"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
    
                                    <Form.Group as={Row} className="mb-3" controlId="formProductPrice">
                                        <Form.Label column sm={4}>
                                            Ár:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                placeholder="Termék ára"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
    
                                    <Form.Group as={Row} className="mb-3" controlId="formProductStock">
                                        <Form.Label column sm={4}>
                                            Készlet:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="number"
                                                name="stockQuantity"
                                                placeholder="Készlet mennyiség"
                                                value={formData.stockQuantity}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
    
                                    <Form.Group as={Row} className="mb-3" controlId="formProductImage">
                                        <Form.Label column sm={4}>
                                            Termék kép URL-je:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="imageUrl"
                                                placeholder="Termék kép URL-je"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Form.Group>
    
                                    <Form.Group as={Row} className="mb-4" controlId="formProductCategory">
                                        <Form.Label column sm={4}>
                                            Kategória:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="category"
                                                value={formData.category.id || ""}
                                                onChange={handleCategoryChange}
                                                required
                                            >
                                                <option value="">Válassz kategóriát</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
    
                                    <Button variant="primary" type="submit" className="w-100">
                                        {id ? "Frissítés" : "Hozzáadás"}
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
                        <strong className="me-auto">Üzenet</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
    
};

export default UpdateProduct;
