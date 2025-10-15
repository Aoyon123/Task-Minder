import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import "../css/app.css";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

function App() {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                const response = await axios.get("/me");
                setUser(response.data.data);
            } catch (error) {
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            }
        }
        setLoading(false);
    };

    const handleLogin = (userData, token) => {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
    };

    const handleLogout = async () => {
        try {
            await axios.post("/logout");
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <AuthPage onLogin={handleLogin} />
            )}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

//ReactDOM mount
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
