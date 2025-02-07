import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Modal,
  Container,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import axios from "axios";

const OrderForm = () => {
  const [order, setOrder] = useState({ customer_id: "", items: [] });
  const [isSubmitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/products");
      setProducts(response.data.map((product) => ({ ...product, quantity: 0 })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!order.customer_id) {
      setErrorMessage("Customer ID is required.");
      return;
    }

    if (orderProducts.length === 0) {
      setErrorMessage("Please add at least one product to the order.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("http://127.0.0.1:5000/orders", {
        customer_id: order.customer_id,
        items: orderProducts.map(({ id, quantity }) => ({ id, quantity })),
      });
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowSuccessModal(false);
    setOrder({ customer_id: "", items: [] });
    setOrderProducts([]);
    navigate("/orders");
  };

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Customer ID:</FormLabel>
            <FormControl
              type="number"
              name="customer_id"
              value={order.customer_id}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </Button>
        </Form>
      </Container>

      <Container>
        <h4>Selected Products</h4>
        <ListGroup>
          {orderProducts.map((product) => (
            <ListGroupItem key={product.id}>
              {product.name} - {product.price} x {product.quantity}
              <Button variant="danger" onClick={() => removeProduct(product.id)}>
                Remove
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>

      <Modal show={showSuccessModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your order has been placed successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </>
  );
};

export default OrderForm;
