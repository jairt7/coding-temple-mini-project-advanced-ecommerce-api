import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Container, ListGroup, Row, Col, ListGroupItem } from "react-bootstrap";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/products");
            setProducts(response.data);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Failed to fetch products. Please try again.");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            setErrorMessage("Failed to delete product. Please try again.");
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h3>Products</h3>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <ListGroup>
                            {products.map((product) => (
                                <ListGroupItem key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                                    <NavLink to={`/product-detail/${product.id}`} className="text-decoration-none">
                                        {product.name}
                                    </NavLink>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>
                                        Delete
                                    </button>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductList;
