USE grocery

--Create tables
CREATE TABLE suppliers (
    id int identity primary key,  
    company_name varchar(50),
    phone_number varchar(20),
    representative_name varchar(50) 
);

CREATE TABLE products (
    id int identity primary key,
    supplier_id int,
    product_name varchar(100),
    price_per_unit decimal(10,2),
    min_quantity int,
    foreign key (supplier_id) references suppliers(id) on delete cascade
);

CREATE TABLE orders (
    id int identity primary key,
    supplier_id int,
    order_date datetime,
	status varchar(20) check (status in ('todo', 'in progress', 'done')),    
    foreign key (supplier_id) references suppliers(id) on delete cascade
);

CREATE TABLE order_items (
    id int identity primary key,
    order_id int,
    product_id int,
    quantity int,
    total_price decimal(10,2),
    foreign key (order_id) references orders(id) on delete cascade,
    foreign key (product_id) references products(id)
);


ALTER TABLE suppliers
add password varchar(20);



CREATE TABLE inventory (
    product_id INT,
    quantity_in_stock INT,
    min_inventory_quantity INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);




