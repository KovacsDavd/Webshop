import { useEffect, useState } from 'react';
import { Button, Container, Table, Row, Col, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../../Service/ApiService.js';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state?.success) {
            if (state.action === "add") {
                setToastMessage("Termék sikeresen hozzáadva!");
            } else {
                setToastMessage("Termék sikeresen frissítve!");
            }
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [state]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ApiService.getAllProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await ApiService.deleteProduct(productId);
            setProducts(products.filter(product => product.id !== productId));
            setToastMessage("Termék sikeresen törölve!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setToastMessage("Hiba történt a termék törlésekor.");
            setShowToast(true);
        }
    };

    const handleUpdate = (productId) => {
        navigate("/admin/product/update", { state: { id: productId } });
    };

    const handleAdd = () => {
        navigate("/admin/product/update");
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <h1 className="text-center">Termékek kezelése</h1>
                    <Button variant="success" className="mb-3" onClick={handleAdd}>Termék hozzáadása</Button>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Kategória</th>
                                <th>Ár</th>
                                <th>Készlet</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.category?.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>
                                        <Button variant="outline-secondary" onClick={() => handleUpdate(product.id)}>Szerkesztés</Button>
                                        <Button variant="outline-danger" onClick={() => handleDelete(product.id)}>Törlés</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <ToastContainer position="top-center">
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header><strong>Success</strong></Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default ProductsPage;
