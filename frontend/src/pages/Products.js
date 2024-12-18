import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import "./Products.css";

const Products = () => {
    const [searchParams] = useSearchParams();
    const categoryName = searchParams.has('category') ? searchParams.get('category') : null;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            let url = 'http://localhost:8080/api/products';
            if (categoryName) {
                url += `?category=${categoryName}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categoryName]);

    return (
        <Container>
            <h1>{categoryName ? `Kategória: ${categoryName}` : 'Összes termék'}</h1>
            <Row>
                {products.map(product => (
                    <Col key={product.id} sm={12} md={6} lg={4}>
                        <Card>
                            <Card.Img variant='top' src={product.imageUrl} alt={product.name} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.price}</Card.Text>
                                <Link to={`/product/${product.id}`} className="btn btn-primary">Részletek</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Products;
