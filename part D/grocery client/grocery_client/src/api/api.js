const API_URL = 'http://localhost:3000'; //move to env 


export const getSuppliers = async () => {
    const res = await fetch(`${API_URL}/suppliers`);
    if (!res.ok) throw Error("Failed getting suppliers");
    return await res.json();
};

export const getOrders = async () => {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw Error("Failed getting orders");
    console.log("Response from API:", res);
    return await res.json();
};


export const postSupplierAndProduct = async (supplierData) => {
    try {
        const res = await fetch(`${API_URL}/suppliers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierData),
        });

        if (!res.ok) {
            throw new Error('Failed to add supplier and products');
        }

        const responseData = await res.json();
        console.log('Response from API:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



export const postCompanyAndPassword = async (loginData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            return { success: false, message: 'Invalid credentials' };
        }
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: 'Network error' };
    }
};


export const getOrdersBySupplier = async (supplierId) => {
    try {
        const response = await fetch(`${API_URL}/orders/${supplierId}`);
        if (!response.ok) {
            throw new Error('Error fetching orders for supplier');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error('Error updating order status');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const getProductsBySupplier = async (supplierId) => {
    try {
        const response = await fetch(`${API_URL}/products/${supplierId}`);

        if (!response.ok) {
            throw new Error('Error fetching products for supplier');
        }
        const data = await response.json();
        console.log("Response from API:", data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const postNewOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Error creating order');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}