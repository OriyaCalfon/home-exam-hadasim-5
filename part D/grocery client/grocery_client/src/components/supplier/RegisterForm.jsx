import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { postSupplierAndProduct } from '../../api/api';
import '../../index.css';

const RegisterForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([{ product_name: '', price_per_unit: '', min_quantity: '' }]);


  const addProduct = () => {
    setProducts([...products, { product_name: '', price_per_unit: '', min_quantity: '' }]);
  };


  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  //submit data
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!companyName || !phoneNumber || !representativeName || products.length === 0 || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all fields',
        confirmButtonColor: 'red'
      });
      return;
    }
    const supplierData = {
      company_name: companyName,
      phone_number: phoneNumber,
      representative_name: representativeName,
      products: products,
      password: password,
    };

    try {
      const response = await postSupplierAndProduct(supplierData);
      console.log('Supplier added successfully:', response);
      Swal.fire({
        icon: 'success',
        text: 'Supplier registered successfully',
        confirmButtonColor: 'red'
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
      Swal.fire({
        icon: 'error',
        text: 'Error registering supplier!',
        confirmButtonColor: 'red'
    });
    }
  };


  return (
    <div className="register-form">
      <h1 className="title">Register Supplier</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Representative Name:</label>
          <input
            type="text"
            value={representativeName}
            onChange={(e) => setRepresentativeName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Products:</label>
          {products.map((product, index) => (
            <div key={index} className="product-input-group">
              <input
                type="text"
                placeholder="Product Name"
                value={product.product_name}
                onChange={(e) => handleProductChange(index, 'product_name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price per Unit"
                value={product.price_per_unit}
                onChange={(e) => handleProductChange(index, 'price_per_unit', e.target.value)}
              />
              <input
                type="number"
                placeholder="Min Quantity"
                value={product.min_quantity}
                onChange={(e) => handleProductChange(index, 'min_quantity', e.target.value)}
              />
            </div>
          ))}
          <button type="button" className="product-button" onClick={addProduct}>Add Product</button>
        </div>

        <button type="submit" className="red-button register-button">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;
