import { useEffect, useState } from "react";
import { getOrders, getSuppliers, updateOrderStatus } from "../../api/api";


const ViewOrdersForManager = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const allOrders = await getOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const allSuppliers = await getSuppliers();
            setSuppliers(allSuppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const updateStatus = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'done');
            fetchAllOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllOrders();
            await fetchSuppliers();
        };
        fetchData();
    }, []);

    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.company_name : 'Unknown Supplier';
    };

    return (
        <div className="general-page">
            <h2 className="title">All Orders</h2>

            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Supplier</th>
                            <th>Order Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={`${order.order_id}-${order.order_date}`}>
                                <td>{order.order_id}</td>
                                <td>{getSupplierName(order.supplier_id)}</td>
                                <td>{new Date(order.order_date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status === 'in progress' && (
                                        <button className="general-button" onClick={() => updateStatus(order.order_id)}>
                                            Confirm order receipt
                                        </button>
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

export default ViewOrdersForManager;
