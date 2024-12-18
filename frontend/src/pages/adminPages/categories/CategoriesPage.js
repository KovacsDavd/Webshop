import { useEffect, useState } from 'react';
import { Button, Container, Table, Row, Col, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../../Service/ApiService.js';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state?.success) {
            if (state.action === "add") {
                setToastMessage("Kategória sikeresen hozzáadva!")
            } else {
                setToastMessage("Kategória sikeresen frissítve!")
            }
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [state]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ApiService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {
        try {
            await ApiService.deleteCategory(categoryId);
            setCategories(categories.filter(category => category.id !== categoryId));
            setToastMessage("Kategória sikeresen törölve!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleUpdate = (categoryId) => {
        navigate("/admin/category/update", { state: { id: categoryId } });
    };

    const handleAdd = () => {
        navigate("/admin/category/update");
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <h1 className="text-center">Kategóriák kezelése</h1>
                    <Button variant="success" className="mb-3" onClick={handleAdd}>Kategória hozzáadása</Button>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>
                                        <Button variant="outline-secondary" onClick={() => handleUpdate(category.id)}>Szerkesztés</Button>
                                        <Button variant="outline-danger" onClick={() => handleDelete(category.id)}>Törlés</Button>
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

export default CategoriesPage;
