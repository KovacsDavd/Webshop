import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const AdminRoute = ({ children }) => {
    const { userRole, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && userRole !== 'ADMIN') {
            navigate('/');
        }
    }, [userRole, loading, navigate]);

    if (loading) {
        return <div>Betöltés...</div>;
    }

    return userRole === 'ADMIN' ? children : null;
};

export default AdminRoute;
