import { useEffect, useState } from "react";
import { Container, Table, Toast, ToastContainer } from "react-bootstrap";
import ApiService from "../Service/ApiService.js";

const ProfilePage = () => {
    const [orders, setOrders] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ApiService.getOrdersByUser();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setToastMessage("Hiba történt a rendelések betöltésekor.");
                setShowToast(true);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Container className="my-4">
            <h1 className="text-center">Profilom</h1>
            <h2 className="text-center my-4">Rendeléseim</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Dátum</th>
                        <th>Összeg</th>
                        <th>Státusz</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>{order.totalAmount} Ft</td>
                                <td>{order.status === "done" ? "Kész" : "Folyamatban"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Nincsenek rendelések.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <ToastContainer position="top-center">
                <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000}>
                    <Toast.Header><strong>Üzenet</strong></Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default ProfilePage;
