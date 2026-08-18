import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/lib/authStore";
import CreateProductForm from "@/components/admin/products/CreateProductForm";

export default function CreateProductPage() {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <CreateProductForm />;
}