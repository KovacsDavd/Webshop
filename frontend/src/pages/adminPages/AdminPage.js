import { Link, Outlet, useNavigate  } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import ApiService from '../../Service/ApiService.js';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await ApiService.logout();
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error('Hiba a kijelentkezéskor:', error);
        }
    };

    return (
        <div>
            <header>
                <nav>
                    <Link to="/admin/users" style={{ margin: '10px' }}>Felhasználók</Link>
                    <Link to="/admin/categories" style={{ margin: '10px' }}>Kategóriák</Link>
                    <Link to="/admin/products" style={{ margin: '10px' }}>Termékek</Link>
                    <Link to="/admin/orders" style={{ margin: '10px' }}>Rendelések</Link>
                    <Link onClick={handleLogout}>
                        <FaSignOutAlt size={24} />
                    </Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPage;
