
const express = require('express');
const { connectToDatabase } = require('./database');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

//functions
// get suppliers
app.get('/suppliers', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const query = 'SELECT * FROM suppliers';
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).send('Error fetching suppliers');
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(500).send('Database connection failed');
    }
});


// get products by supplierId
app.get('/products/:supplierId', async (req, res) => {
    const supplierId = req.params.supplierId;

    try {
        const connection = await connectToDatabase();
        const query = `
       SELECT id, product_name, min_quantity
        FROM products
        WHERE supplier_id = ?
      `;
        connection.query(query, [supplierId], (err, results) => {
            if (err) {
                return res.status(500).send('Error fetching products');
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send('Database connection failed');
    }
});


// get orders
app.get('/orders', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const query = 'SELECT id AS order_id, supplier_id, order_date, status FROM orders';
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).send('Error fetching orders');
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(500).send('Database connection failed');
    }
});



// get orders by supplierId
app.get('/orders/:supplierId', async (req, res) => {
    const supplierId = req.params.supplierId;

    try {
        const connection = await connectToDatabase();
        const query = `
        SELECT o.id AS order_id, o.order_date, o.status,
               oi.id AS item_id, p.product_name, oi.quantity
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.supplier_id = ?
        ORDER BY o.order_date DESC
    `;

        connection.query(query, [supplierId], (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).send('Error fetching orders');
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send('Database connection failed');
    }
});


// post suppliers
app.post('/suppliers', async (req, res) => {
    const { company_name, phone_number, representative_name, products, password } = req.body;

    try {
        const connection = await connectToDatabase();

        // supplier query
        const insertSupplierQuery = `
            INSERT INTO suppliers (company_name, phone_number, representative_name, password)
            OUTPUT INSERTED.id
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertSupplierQuery, [company_name, phone_number, representative_name, password], (err, result) => {
            if (err) {
                console.error('Error inserting supplier:', err);
                return res.status(500).send('Error inserting supplier');
            }

            const supplierId = result[0].id;

            // product queries
            const productQueries = products.map((product) => {
                const insertProductQuery = `
                    INSERT INTO products (supplier_id, product_name, price_per_unit, min_quantity)
                    VALUES (?, ?, ?, ?)
                `;

                return new Promise((resolve, reject) => {
                    connection.query(insertProductQuery, [supplierId, product.product_name, product.price_per_unit, product.min_quantity], (err) => {
                        if (err) {
                            console.error('Error inserting product:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Wait for all product insertions to complete
            Promise.all(productQueries)
                .then(() => {
                    res.status(200).json({ message: 'Supplier and products added successfully' });
                })
                .catch((error) => {
                    console.error('Error inserting products:', error);
                    res.status(500).json({ error: 'Error creating supplier' });
                });
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).send('Error creating supplier');
    }
});


// post company_name and password
// TODO - handle bcrypt password
// TODO - handle token
app.post('/login', async (req, res) => {
    const { company_name, password } = req.body;

    try {
        const connection = await connectToDatabase();
        const query = `
      SELECT * FROM suppliers WHERE company_name = ? AND password = ?
    `;
        connection.query(query, [company_name, password], (err, result) => {
            if (err) {
                console.error('Error querying supplier:', err);
                return res.status(500).send('Error during login');
            }
            if (result.length > 0) {
                res.status(200).json({ message: 'Login successful', supplier: result[0] });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Post new order
app.post('/orders', async (req, res) => {
    const { supplierId, orderDate, items } = req.body;
    const orderDateToUse = orderDate || new Date();

    try {
        const connection = await connectToDatabase();
        const query = `
            INSERT INTO orders (supplier_id, order_date, status)
            OUTPUT INSERTED.id AS order_id
            VALUES (?, ?, 'todo');
        `;

        connection.query(query, [supplierId, orderDateToUse], (err, result) => {
            if (err) {
                console.error('Error creating order:', err);
                return res.status(500).send('Error creating order');
            }

            const orderId = result[0].order_id;
            const orderItemsQuery = items.map(item => {
                const productId = item.product_id;
                const quantity = Number(item.quantity);
                const insertItemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity)
                    VALUES (?, ?, ?);
                `;

                return new Promise((resolve, reject) => {
                    connection.query(insertItemQuery, [orderId, productId, quantity], (err) => {
                        if (err) {
                            console.error('Error adding order item:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });
            Promise.all(orderItemsQuery)
                .then(() => res.status(200).json({ message: 'Order created successfully', orderId }))
                .catch((error) => {
                    console.error('Error adding order items:', error);
                    res.status(500).send('Error adding order items');
                });
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send('Database connection failed');
    }
});


// Put order status
app.put('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const connection = await connectToDatabase();

    const query = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;
    connection.query(query, [status, parseInt(orderId)], (err, results) => {
        if (err) return res.status(500).send('Update failed');
        res.json({ message: 'Order updated', status: 'success' });
    });
});






//Bonus
app.post('/purchase', async (req, res) => {
    const purchasedItems = req.body; // { product_name: quantity_purchased }

    try {
        const connection = await connectToDatabase();

        const productNames = Object.keys(purchasedItems);
        let errorOccurred = false;

        let count = 0;
        for (let productName of productNames) {
            const quantityPurchased = purchasedItems[productName];


            // check if product has suppliers
            const hasSupplier = await checkIfProductHasSuppliers(connection, productName);
            if (!hasSupplier) {
                return res.status(400).send('Product has no suppliers');
            }

            // update inventory
            const updateStockQuery = `
                UPDATE inventory
                SET quantity_in_stock = quantity_in_stock - ?
                WHERE product_id = (SELECT id FROM products WHERE product_name = ?)
            `;
            connection.query(updateStockQuery, [quantityPurchased, productName], (err) => {
                if (err) {
                    console.error('Error updating inventory:', err);
                    errorOccurred = true;
                    return res.status(500).send('Error updating inventory');
                }

                // check inventory after purchase
                const checkStockQuery = `
                     SELECT 
                     inventory.quantity_in_stock, 
                     inventory.min_inventory_quantity, 
                     products.id AS product_id, 
                     products.price_per_unit, 
                     products.min_quantity, 
                     products.supplier_id 
                     FROM inventory
                     JOIN products ON products.id = inventory.product_id
                     WHERE products.product_name = ?
                   `;
                connection.query(checkStockQuery, [productName], (err, results) => {
                    if (err) {
                        console.error('Error checking inventory:', err);
                        errorOccurred = true;
                        return res.status(500).send('Error checking inventory');
                    }

                    const product = results[0];
                    console.log('Product details from DB:', product);
                    if (product && product.quantity_in_stock < product.min_inventory_quantity) {
                        const orderQuantity = Math.max(product.min_quantity, product.min_inventory_quantity - product.quantity_in_stock);

                        //if inventory is less than min_inventory_quantity- then order from supplier
                        console.log(`Should order ${orderQuantity} of ${productName} from supplier ${product.supplier_id}`);
                        orderProductFromSupplier(connection, product.supplier_id, product.product_id, orderQuantity);
                    }
                    count++;

                    if (count === productNames.length && !errorOccurred) {
                        res.status(200).send('Purchase recorded and inventory updated');
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error processing purchase:', err);
        res.status(500).send('Error processing purchase');
    }
});



//Create automated order from supplier
const orderProductFromSupplier = (connection, supplierId, productId, orderQuantity) => {
    const orderDate = new Date();
    const status = 'todo';

    // Cretae order in orders table
    const orderQuery = `
        INSERT INTO orders (supplier_id, order_date, status)
        OUTPUT INSERTED.id AS order_id
        VALUES (?, ?, ?)
    `;
    connection.query(orderQuery, [supplierId, orderDate, status], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            return;
        }

        const orderId = result[0].order_id;
        console.log(`OrderId: ${orderId}`);

        const productIdInt = parseInt(productId, 10);
        const orderQuantityInt = parseInt(orderQuantity, 10);

        if (isNaN(productIdInt) || isNaN(orderQuantityInt)) {
            console.error('Invalid productId or orderQuantity');
            return;
        }

        // Insert order items in order_items table
        const itemQuery = `
            INSERT INTO order_items (order_id, product_id, quantity)
            VALUES (?, ?, ?)
        `;

        connection.query(itemQuery, [orderId, productIdInt, orderQuantityInt], (err2) => {
            if (err2) {
                console.error('Error inserting order item:', err2);  
                return;
            }
            console.log(`Order #${orderId} placed: ${orderQuantityInt} units of product ${productIdInt} from supplier ${supplierId}`); // לוג הצלחה
        });
    });
};



// check if product has suppliers
function checkIfProductHasSuppliers(connection, productName) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) AS count 
            FROM products 
           WHERE product_name = ? AND supplier_id IS NOT NULL
        `;
        connection.query(query, [productName], (err, results) => {
            if (err) {
                return reject(err);
            }
            const count = results[0].count;
            resolve(count > 0);
        });
    });
}




// start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
