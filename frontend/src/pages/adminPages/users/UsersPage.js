import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import Row from "react-bootstrap/Row"
import Table from "react-bootstrap/Table"
import Col from "react-bootstrap/Col"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ApiService from '../../../Service/ApiService';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state?.success) {
            if (state.action === "add") {
                setToastMessage("Felhasználó sikeresen hozzáadva!")
            } else {
                setToastMessage("Felhasználó sikeresen frissítve!")
            }
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [state]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await ApiService.getAllUsers();
                console.log('API response:', response);
                setUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await ApiService.deleteUser(userId);
            setUsers(users.filter(user => user.userDTO.id !== userId));
            setToastMessage("Felhasználó sikeresen törölve!")
            setTimeout(() => setShowToast(true), 3000);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdate = (userId) => {
        navigate("/admin/user/update", { state: { id: userId } });
    }

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h1 className="text-center">Felhasználók kezelése</h1>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Keresztnév</th>
                                    <th>Vezetéknév</th>
                                    <th>Email</th>
                                    <th>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.userDTO.id}>
                                            <td>{user.userDTO.firstName}</td>
                                            <td>{user.userDTO.lastName}</td>
                                            <td>{user.userDTO.email}</td>
                                            <td>
                                                <Button variant="outline-secondary" onClick={() => handleUpdate(user.userDTO.id)}>Szerkesztés</Button>
                                                <Button variant="outline-danger" onClick={() => handleDelete(user.userDTO.id)}>Törlés</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nincsenek elérhető felhasználók.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>


            <ToastContainer position="top-center" className="mt-5">
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default UsersPage;
