import { useEffect } from "react";
import { useAuth } from "../Contexts/AuthProvider"
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate])
    return (
        { children }
    )
}

export default ProtectedRoute
