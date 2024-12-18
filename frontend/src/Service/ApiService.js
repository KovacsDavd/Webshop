import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {

    static refreshTimeout = null;
    static axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });

    static setAccessToken(token) {
        if (token) {
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.axiosInstance.defaults.headers.common['Authorization'];
        }
    }

    static scheduleTokenRefresh(expiresIn) {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        const refreshTime = (expiresIn - 20) * 1000;
        this.refreshTimeout = setTimeout(async () => {
            try {
                console.log("Refreshing token...");
                await this.refreshAccessToken();
            } catch (error) {
                console.error("Hiba történt a token frissítésekor:", error);
            }
        }, refreshTime);

        console.log(`Token refresh scheduled in ${refreshTime / 1000} seconds.`);
    }

    static async logout() {
        try {
            await this.axiosInstance.post('/auth/logout');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('tokenExpirationTime');
        } catch (error) {
            console.error('Hiba a kijelentkezéskor:', error);
        }
    }

    static async login(email, password) {
        const response = await this.axiosInstance.post('/auth/login', { email, password });
        const { token, expirationTime } = response.data;

        sessionStorage.setItem('accessToken', token);
        sessionStorage.setItem('tokenExpirationTime', Date.now() + expirationTime * 1000);

        this.setAccessToken(token);

        if (expirationTime) {
            console.log('Token will expire in', expirationTime, 'seconds.');
        } else {
            console.warn('No expiration time received.');
        }

        this.scheduleTokenRefresh(expirationTime);
        return response.data;
    }

    static async signUp(userData) {
        try {
            return this.axiosInstance.post('/auth/signup', userData);
        } catch (error) {
            console.log("Hiba regisztrációkor: ", error);
        }
    }

    static async restoreTokenRefresh() {
        const token = sessionStorage.getItem('accessToken');
        const expirationTime = sessionStorage.getItem('tokenExpirationTime');

        if (!token || !expirationTime) {
            console.warn("No token or expiration time found in sessionStorage.");
            try {
                await this.refreshAccessToken();
            } catch (error) {
                console.error("Failed to restore token via refresh:", error);
            }
        }

        const timeRemaining = expirationTime - Date.now();
        if (timeRemaining > 0) {
            console.log(`Restoring token refresh. Time remaining: ${timeRemaining / 1000} seconds.`);
            this.setAccessToken(token);
            this.scheduleTokenRefresh(timeRemaining / 1000);
        } else {
            console.warn("Token expired. User needs to log in again.");
        }
    }

    static async refreshAccessToken() {
        try {
            const response = await this.axiosInstance.post('/auth/refresh');
            const { token, expirationTime } = response.data;

            if (!token || !expirationTime) {
                console.error("Token vagy expirationTime hiányzik a refresh válaszból.");
                return;
            }

            sessionStorage.setItem('accessToken', token);
            sessionStorage.setItem('tokenExpirationTime', Date.now() + expirationTime * 1000);
            this.setAccessToken(token);

            console.log(`New token received. Expires in ${expirationTime} seconds.`);
            this.scheduleTokenRefresh(expirationTime);

            return response.data;
        } catch (error) {
            console.error("Nincs refresh:", error);
            throw error;
        }
    }

    static async getAllUsers() {
        return this.axiosInstance.get('/users');
    }

    static async getUser(id) {
        return this.axiosInstance.get(`/user/${id}`);
    }

    static async deleteUser(userId) {
        return this.axiosInstance.delete(`/user/${userId}`);
    }

    static async updateUser(userId, userData) {
        return this.axiosInstance.put(`/user/${userId}`, userData);
    }

    static async getAllCategories() {
        return this.axiosInstance.get('/categories');
    }

    static async getCategory(id) {
        return this.axiosInstance.get(`/category/${id}`);
    }

    static async deleteCategory(id) {
        return this.axiosInstance.delete(`/category/${id}`);
    }

    static async updateCategory(id, data) {
        return this.axiosInstance.put(`/category/${id}`, data);
    }

    static async addCategory(data) {
        return this.axiosInstance.post('/category', data);
    }

    static async getAllProducts() {
        return this.axiosInstance.get('/products');
    }

    static async getProduct(id) {
        return this.axiosInstance.get(`/product/${id}`);
    }

    static async deleteProduct(id) {
        return this.axiosInstance.delete(`/product/${id}`);
    }

    static async updateProduct(id, data) {
        return this.axiosInstance.put(`/product/${id}`, data);
    }

    static async addProduct(data) {
        return this.axiosInstance.post('/product', data);
    }

    static async getAllOrders() {
        return this.axiosInstance.get('/orders');
    }

    static async updateOrder(id, data) {
        return this.axiosInstance.put(`/order/${id}`, data);
    }

    static async deleteOrder(id) {
        return this.axiosInstance.delete(`/order/${id}`);
    }

    static async createOrder(orderRequest) {
        return await this.axiosInstance.post('/order', orderRequest);
    }

    static async getOrdersByUser() {
        return await this.axiosInstance.get("/orders/user");
    }


    static async checkLoginStatus() {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            return false;
        }

        const isValid = await this.isTokenValid(token);
        return isValid;
    }

    static async isTokenValid(token) {
        try {
            const response = await this.axiosInstance.get('/auth/validate-token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch {
            return false;
        }
    }

    static async getUserRole() {
        try {
            const response = await this.axiosInstance.get('/auth/role');
            return response.data;
        } catch (error) {
            console.error("Hiba történt a role lekérdezésekor:", error);
            return null;
        }
    }

    static async getOrCreateCart() {
        try {
            const response = await this.axiosInstance.get('/cart');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch or create cart:", error);
            throw error;
        }
    }

    static async updateCartItem(itemId, quantity) {
        const response = await this.axiosInstance.put(`/cart/items/${itemId}`, null, {
            params: { quantity },
        });
        return response.data;
    }

    static async removeCartItem(itemId) {
        return await this.axiosInstance.delete(`/cart/item/${itemId}`);
    }

    static async addItemToCart(productId, quantity) {
        try {
            const token = sessionStorage.getItem('accessToken');

            if (!token) {
                console.error('User is not authenticated!');
                return;
            }
            const response = await this.axiosInstance.post(`/cart/item/${productId}`, null, {
                params: { quantity },
            });
            return response.data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }
}

export default ApiService;
