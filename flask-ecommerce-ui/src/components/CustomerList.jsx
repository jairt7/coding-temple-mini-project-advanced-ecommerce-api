import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Button, Alert, Container, Accordion, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrderList from "./OrderList";

const CustomerList = ({ onCustomerSelect }) => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching customers. Please try again later.");
        }
    };

    const deleteCustomer = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:5000/customers/${customerId}`);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            setError("Error deleting customer. Please try again.");
        }
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <h3 className="mt-3 mb-3 text-center">Customers</h3>
            <ListGroup>
                {customers.map(customer => (
                    <ListGroup.Item 
                        key={customer.id} 
                        className="d-flex justify-content-between align-items-top shadow-sm p-3 mb-3 bg-white rounded"
                    >
                        <Accordion>
                            <Accordion.Item eventKey={customer.id.toString()}>
                                <Accordion.Header>
                                    <p>{customer.name}</p>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>Email: {customer.email}</p>
                                    <p>Phone: {customer.phone}</p>
                                    <OrderList customerId={customer.id} />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <div>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => {
                                    if (onCustomerSelect) onCustomerSelect(customer.id);
                                    navigate(`/customers/${customer.id}`);
                                }} 
                                className="me-2"
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => deleteCustomer(customer.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

CustomerList.propTypes = {
    onCustomerSelect: PropTypes.func
};

export default CustomerList;
