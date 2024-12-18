import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <header style={{ backgroundColor: '#f4f4f4', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <nav>
                <Link to="/admin/users" style={{ margin: '10px' }}>Felhasználók</Link>
                <Link to="/admin/categories" style={{ margin: '10px' }}>Kategóriák</Link>
                <Link to="/admin/products" style={{ margin: '10px' }}>Termékek</Link>
                <Link to="/admin/orders" style={{ margin: '10px' }}>Rendelések</Link>
            </nav>
        </header>
    );
};

export default AdminHeader;
