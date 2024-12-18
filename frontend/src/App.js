import './App.css';
import Header from './Components/Header';
import DashBoard from './pages/DashBoard';
import Products from './pages/Products';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Service/AuthContext.js';
import ProductPage from './pages/ProductPage.js';
import AdminRoute from './Service/AdminRoute.js';
import AdminPage from './pages/adminPages/AdminPage.js';
import UsersPage from './pages/adminPages/users/UsersPage.js';
import UpdateUSer from './pages/adminPages/users/UpdateUser.js';
import CategoriesPage from './pages/adminPages/categories/CategoriesPage.js';
import UpdateCategory from './pages/adminPages/categories/UpdateCategory.js';
import UpdateProduct from './pages/adminPages/products/UpdateProduct.js';
import ProductsPage from './pages/adminPages/products/ProductsPage.js';
import OrdersPage from './pages/adminPages/orders/OrdersPage.js';
import ProfilePage from './pages/ProfilePage.js';
import CartPage from './pages/cart/CartPage.js';
import CheckoutPage from './pages/checkout/CheckoutPage.js';

function App() {
  const location = useLocation();

  // Ellenőrzés: az útvonal tartalmazza-e az "/admin" részt
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="App">
        {/* Csak akkor jelenítjük meg a Header-t, ha nem admin oldal */}
        {!isAdminRoute && <Header />}
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
            <Route path="users" element={<UsersPage />} />
            <Route path="user/update" element={<UpdateUSer />} />

            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/update" element={<UpdateCategory />} />

            <Route path="products" element={<ProductsPage />} />
            <Route path="product/update" element={<UpdateProduct />} />

            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
