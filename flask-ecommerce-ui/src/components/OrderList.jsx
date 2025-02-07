import { func, number } from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = ({ customerId, onOrderSelect }) => {
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/orders?customer_id=${customerId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        
        if (customerId) {
            fetchOrders();
        }
    }, [customerId]);

    return (
        <div className='order-list'>
            <h4>Orders</h4>
            {orders.length === 0 ? (
                <p>No orders found for this customer.</p>
            ) : (
                <ul className="list-group">
                    {orders.map(order => (
                        <li 
                            key={order.id} 
                            className="list-group-item"
                            onClick={() => {
                                setOrderId(order.id);
                                if (onOrderSelect) onOrderSelect(order.id);
                            }}
                        >
                            <h5>Order details</h5>
                            <p>Order ID: {order.id}</p>
                            <p>Customer ID: {order.customer_id}</p>
                            <p>Shipping date: {order.shipping_date}</p>
                            <p>Arrival date: {order.arrival_date}</p>
                            <p>Order status: {order.order_status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

OrderList.propTypes = {
    customerId: number,
    onOrderSelect: func
};

export default OrderList;
