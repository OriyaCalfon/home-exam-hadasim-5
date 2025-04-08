import React, { useEffect, useState } from 'react';
import { getOrdersBySupplier, updateOrderStatus } from '../../api/api';
import '../../index.css';

const ViewOrdersForSupplier = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const supplierIdFromStorage = localStorage.getItem('supplierId');

            if (supplierIdFromStorage) {
                const data = await getOrdersBySupplier(supplierIdFromStorage);
                const groupedOrders = data.reduce((acc, order) => {
                    if (!acc[order.order_id]) {
                        acc[order.order_id] = {
                            order_id: order.order_id,
                            order_date: order.order_date,
                            status: order.status,
                            products: [],
                        };
                    }
                    acc[order.order_id].products.push({
                        product_name: order.product_name,
                        quantity: order.quantity,
                    });
                    return acc;
                }, {});

                setOrders(Object.values(groupedOrders));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const updateStatus = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'in progress');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);


    return (
        <div className="general-page">
            <h2 className="title">Supplier Orders</h2>

            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Quantities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            .filter((order) => order.status !== 'done')
                            .map((order) => (
                                <tr key={order.order_id}>
                                    <td>{order.order_id}</td>
                                    <td>{new Date(order.order_date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.products.map((product, index) => (
                                            <div key={index}>{product.product_name}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {order.products.map((product, index) => (
                                            <div key={index}>{product.quantity}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {order.status === 'todo' && (
                                            <button className="general-button" onClick={() => updateStatus(order.order_id)}>Confirm order</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewOrdersForSupplier;
