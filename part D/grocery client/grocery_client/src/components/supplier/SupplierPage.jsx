import { Link } from "react-router-dom";
import '../../index.css';

const SupplierPage = () => {
    return (
        <div className="supplier-page">
            <Link to="/login">
                <button className="red-button">Login</button>
            </Link>
            <div className="link-container">
                <p className="text">Not have an account yet?</p>

                <Link to="/register">
                    <button className="red-button">Register</button>
                </Link>
            </div>
        </div>
    );
}

export default SupplierPage;
