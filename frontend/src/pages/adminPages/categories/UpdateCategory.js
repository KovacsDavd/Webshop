import { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService';

const UpdateCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        const response = await ApiService.getCategory(id);
        setFormData(response.data);
      }
    };
    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await ApiService.updateCategory(id, formData);
      } else {
        await ApiService.addCategory(formData);
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h1 className="text-center mb-4">
            {id ? "Kategória Szerkesztése" : "Kategória Hozzáadása"}
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                name="name"
                placeholder="Kategória neve"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3 w-100">
              {id ? "Mentés" : "Hozzáadás"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateCategory;
