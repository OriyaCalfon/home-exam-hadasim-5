
import { Link } from "react-router-dom";
import '../../index.css';


const ManagerPage = () => {


    return (
        <>

            <div className="manager-page">
                <h1 className="title">Hello manager</h1>
                <div className="button-container">
                    <Link to="/orderForm">
                        <button className="red-button">Create new order</button>
                    </Link>


                    <Link to="/viewOrdersForManager">
                        <button className="red-button">View orders</button>
                    </Link>
                </div>
            </div>

        </>
    );
}

export default ManagerPage;