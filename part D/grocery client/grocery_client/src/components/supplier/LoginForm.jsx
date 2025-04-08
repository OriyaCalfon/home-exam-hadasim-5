import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { postCompanyAndPassword } from "../../api/api";
import '../../index.css';


const LoginForm = () => {
    const [companyName, setCompanyName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!companyName || !password) {
            await Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill all fields',
                confirmButtonColor: 'red'
            });
            return;
        }
        const loginData = {
            company_name: companyName,
            password: password,
        };

        const result = await postCompanyAndPassword(loginData);
        if (result.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/ViewOrdersForSupplier');
            localStorage.setItem('supplierId', result.data.supplier.id);
            console.log('Login successful:', result.data.supplier.id);
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: result.message,
                confirmButtonColor: 'red'
            });
        }
    };

    return (
        <form onSubmit={handleLogin} className="general-page">
            <h2 className="title">Login supplier</h2>
            <div>
                <label className="text">Company Name: </label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input"
                />
            </div>

            <div>
                <label className="text">Password: </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
            </div>

            <button type="submit" className="red-button">Login</button>
        </form>
    );
};

export default LoginForm;