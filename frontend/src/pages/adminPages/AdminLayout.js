    import { Outlet } from 'react-router-dom';
    import AdminHeader from './AdminHeader';

    const AdminLayout = () => {
        return (
            <div>
                <AdminHeader />
                
                <main>
                    <Outlet />
                </main>
            </div>
        );
    };

    export default AdminLayout;
