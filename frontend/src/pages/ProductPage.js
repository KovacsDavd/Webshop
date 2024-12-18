import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../Service/ApiService.js";
import { Drawer, Button, Typography } from "@mui/material";
import "./ProductPage.css";

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleAddToCart = async () => {
        try {
            await ApiService.getOrCreateCart();

            await ApiService.addItemToCart(product.id, quantity);

            setDrawerOpen(true);
        } catch (error) {
            console.error('Hiba a kosárhoz adáskor:', error);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ApiService.axiosInstance.get(`/product/${id}`);
                setProduct(response.data);

                if (response.data.stockQuantity === 0) {
                    setQuantity(0);
                }
            } catch (error) {
                console.error("Hiba a termék betöltésekor:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleIncrease = () => {
        if (quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (!product) {
        return <div>Betöltés...</div>;
    }

    return (
        <div className="product-details-container">
            <hr className="separator" />
            <div className="product-details-content">
                <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-description">{product.description}</p>
                    <h2 className="product-price">${product.price}</h2>

                    <div className="availability">
                        {product.stockQuantity > 0 ? (
                            <>
                                <span className="availability-status available">
                                    Elérhető
                                </span>
                                <p className="delivery-time">
                                    Várható szállítás: 1-3 munkanap
                                </p>
                            </>
                        ) : (
                            <span className="availability-status unavailable">
                                Nem elérhető
                            </span>
                        )}
                    </div>

                    <div className="quantity-control">
                        <button
                            className={`quantity-button ${quantity <= 1 ? "disabled" : ""}`}
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="quantity-display">{quantity}</span>
                        <button
                            className={`quantity-button ${quantity >= product.stockQuantity || product.stockQuantity === 0
                                    ? "disabled"
                                    : ""
                                }`}
                            onClick={handleIncrease}
                            disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="add-to-cart-button"
                        disabled={product.stockQuantity === 0}
                        onClick={handleAddToCart}
                    >
                        Kosárhoz adás
                    </button>
                </div>
            </div>
            <hr className="separator" />

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <div className="drawer-content">
                    <Typography variant="h6" gutterBottom>
                        Termék sikeresen hozzáadva a kosárhoz!
                    </Typography>
                    <div className="drawer-buttons">
                        <Button
                            variant="contained"
                            color="primary"
                            className="drawer-button"
                            onClick={() => window.location.href = '/cart'}
                        >
                            Kosár megtekintése
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className="drawer-button"
                            onClick={() => window.location.href = '/products'}
                        >
                            Tovább nézelődök
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default ProductPage;
