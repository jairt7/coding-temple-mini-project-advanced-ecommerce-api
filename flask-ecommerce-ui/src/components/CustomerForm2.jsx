import { Component } from "react";
import axios from "axios";
import { func, number } from "prop-types";
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            errors: {},
            isLoading: false,
            error: null,
            selectedCustomerId: null,
            showSuccessModal: false,
        };
    }

    componentDidMount() {
        const { id } = this.props.params;
        if (id) {
            this.fetchCustomerData(id);
        }
    }

    fetchCustomerData = (id) => {
        axios
            .get(`http://127.0.0.1:5000/customers/${id}`)
            .then((response) => {
                const customerData = response.data;
                this.setState({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    selectedCustomerId: id,
                });
            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    validateForm = () => {
        const errors = {};
        const { name, email, phone } = this.state;

        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        if (!phone.trim()) errors.phone = "Phone is required";

        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({ errors });

        if (Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null });

            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim(),
            };
            const apiUrl = `http://127.0.0.1:5000/customers/${this.state.selectedCustomerId}`

            const httpMethod = axios.put;

            httpMethod(apiUrl, customerData)
                .then(() => {
                    this.setState({
                        name: "",
                        email: "",
                        phone: "",
                        errors: {},
                        selectedCustomerId: null,
                        isLoading: false,
                        showSuccessModal: true
                    });
                    
                })
                .catch((error) => {
                    this.setState({ error: error.toString(), isLoading: false });
                });
        } else {
            this.setState({ errors })
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: "",
            email: "",
            phone: "",
            errors: "",
            selectedCustomerId: null
        });
        this.props.navigate('/customers')
    }

    render() {
        const { name, email, phone, errors, error, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
                {error && <Alert variant="danger">Error submitting customer data: {error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                            isInvalid={!!errors.name}
                        />
                        {errors.name && <div style={{color: 'danger'}}>{errors.name}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={this.handleChange}
                            isInvalid={!!errors.email}
                        />
                        {errors.email && <div style={{color: 'danger'}}>{errors.email}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={this.handleChange}
                            isInvalid={!!errors.phone}
                        />
                        {errors.phone && <div style={{color: 'danger'}}>{errors.phone}</div>}
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        Update Customer
                    </Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The customer has been successfully updated.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        );
    }
}

CustomerForm.propTypes = {
    customerId: number,
    onUpdateCustomerList: func,
};

export default CustomerForm;
