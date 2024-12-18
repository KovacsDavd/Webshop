import React, { useEffect, useState, useContext } from 'react';
import { Container, Nav, Navbar, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import AuthContext from '../Service/AuthContext.js';
import ApiService from '../Service/ApiService.js';
import './Header.css';

const Header = () => {
    const [categories, setCategories] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = async () => {
        try {
            await ApiService.logout();
            window.location.reload();
        } catch (error) {
            console.error('Hiba a kijelentkezéskor:', error);
        }
    };

    return (
        <Navbar className="header-navbar">
            <Container className="header-container">
                <div className="header-top">
                    <Navbar.Brand as={Link} to="/" className="navbar-brand">
                        Webshop
                    </Navbar.Brand>

                    <Form className="search-form">
                        <FormControl
                            type="search"
                            placeholder="Milyen terméket keresel?"
                            className="search-input"
                            aria-label="Search"
                        />
                        <FaSearch className="search-icon" size={20} />
                    </Form>

                    <Nav className="header-icons">
                        {isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/profile">
                                    <FaUserCircle size={24} color="white" title="Profil" />
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>
                                    <FaSignOutAlt size={24} color="white" />
                                </Nav.Link>
                                <Nav.Link as={Link} to="/cart">
                                    <FaShoppingCart size={24} color="white" />
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <FaUser size={24} color="white" />
                            </Nav.Link>
                        )}
                    </Nav>
                </div>

                <div className="header-bottom">
                    <Dropdown>
                        <Dropdown.Toggle variant="link" id="dropdown-basic" className="dropdown-toggle">
                            Minden kategória
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {categories.map((category) => (
                                <Dropdown.Item as={Link} to={`/products?category=${category.name}`} key={category.id}>
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Nav>
                        <Nav.Link as={Link} to="/products">
                            Összes termék
                        </Nav.Link>
                    </Nav>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;
