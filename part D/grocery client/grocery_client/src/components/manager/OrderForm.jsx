import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getProductsBySupplier, getSuppliers, postNewOrder } from '../../api/api';
import '../../index.css';


const OrderForm = () => {
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState([{ product_id: '', quantity: '' }]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);


    const fetchSuppliers = async () => {
        const data = await getSuppliers();
        setSuppliers(data);
    };


    const fetchProducts = async () => {
        if (!supplierId) return;
        try {
            const data = await getProductsBySupplier(supplierId);
            setProducts(data);
        } catch (error) {
            setError('Error fetching products');
        }
    };


    useEffect(() => {
        fetchSuppliers();
        fetchProducts();
    }, [supplierId]);



    const addItem = () => {
        setItems([...items, { product_id: '', quantity: '' }]);
    };


    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const product = products.find(p => p.id === parseInt(item.product_id));

            if (product && parseInt(item.quantity) < product.min_quantity) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Quantity Too Low',
                    text: `Item ${product.product_name} must have a minimum quantity of ${product.min_quantity}`,
                    confirmButtonColor: '#d33'
                });
                return;
            }
        }
        const orderData = {
            supplierId,
            items
        };

        const res = await postNewOrder(orderData);
        if (res.error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.error,
                confirmButtonColor: '#d33'
            });
            return;
        }
        else {
            await Swal.fire({
                icon: 'success',
                title: 'Order Created',
                text: 'Order created successfully!',
                confirmButtonColor: '#d33'
            });
            setItems([{ product_id: '', quantity: '' }]);
            setSupplierId('');
        }
    };


    return (
        <div className="order-form">
            <h1 className="title">Create Order</h1>
            <form onSubmit={handleSubmit} className="form-container">

                <div className='input-group'>
                    <label>Supplier: </label>
                    <select
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.company_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div >
                    <h3>Items:</h3>
                    {items.map((item, index) => (
                        <div key={index} >
                            <div>
                                <label>Product: </label>
                                <select
                                    name="product_id"
                                    value={item.product_id}
                                    onChange={(e) => handleItemChange(index, e)}
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='input-quantity'>
                                <label>Quantity: </label><br />
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-item-button" onClick={addItem}>Add Item</button>
                </div>

                <button type="submit" className="red-button submit-button">Submit Order</button>
            </form>
        </div>
    );
};

export default OrderForm;

