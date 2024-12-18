import { useEffect, useState } from 'react';
import { Button, Container, Table, Toast, ToastContainer } from 'react-bootstrap';
import ApiService from '../../../Service/ApiService';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ApiService.getAllOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            await ApiService.deleteOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
            setToastMessage("Rendelés sikeresen törölve!");
            setShowToast(true);
        } catch (error) {
            console.error("Error deleting order:", error);
            setToastMessage("Hiba történt a rendelés törlésekor.");
            setShowToast(true);
        }
    };

    const handleMarkAsDone = async (orderId) => {
        try {
            const updatedOrder = { ...orders.find(order => order.id === orderId), status: "done" };
            await ApiService.updateOrder(orderId, updatedOrder);
            setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
            setToastMessage("Rendelés státusza 'Kész'-re állítva!");
            setShowToast(true);
        } catch (error) {
            console.error("Error updating order status:", error);
            setToastMessage("Hiba történt a rendelés státuszának frissítésekor.");
            setShowToast(true);
        }
    };

    return (
        <Container>
            <h1 className="text-center my-4">Rendelések Kezelése</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Dátum</th>
                        <th>Összeg</th>
                        <th>Státusz</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.user.email}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>{order.totalAmount} Ft</td>
                                <td>{order.status === "done" ? "Kész" : "Folyamatban"}</td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        className="me-2"
                                        onClick={() => handleDelete(order.id)}
                                    >
                                        Törlés
                                    </Button>
                                    {order.status !== "done" && (
                                        <Button
                                            variant="outline-success"
                                            onClick={() => handleMarkAsDone(order.id)}
                                        >
                                            Kész
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Nincsenek rendelések.</td>
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

export default OrdersPage;
