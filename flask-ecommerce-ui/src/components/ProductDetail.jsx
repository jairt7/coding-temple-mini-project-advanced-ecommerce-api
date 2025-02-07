import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Accordion, Button, Container, Row, Col } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
      setProduct(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to load product details. Please try again.");
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/products/${id}`);
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Failed to delete product. Please try again.");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-top shadow-sm p-3 mb-3 bg-white rounded">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {product.name ? (
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="1">
                  <Accordion.Header>{product.name}</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>ID: {product.id}</li>
                      <li>Price: {product.price}</li>
                      <li>Stock: {product.stock}</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
              <p>Loading product details...</p>
            )}

            <div>
              <Button
                variant="primary"
                onClick={() => navigate(`/products/edit/${product.id}`)}
                className="me-2"
              >
                Edit
              </Button>
              <Button variant="danger" onClick={deleteProduct}>
                Delete
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
