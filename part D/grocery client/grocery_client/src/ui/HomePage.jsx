import { Link } from "react-router-dom";
import './../index.css';

function HomePage() {
    return (
        <div className="home-page">
            <h1 className="title">Welcome to the best grocery</h1>
            
            <div className="button-container">
                <Link to="/supplier">
                    <button className="red-button">Supplier</button>
                </Link>

                <Link to="/manager">
                    <button className="red-button">Manager</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
