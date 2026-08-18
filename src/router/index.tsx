import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CreateProductPage from "@/pages/CreateProductPage";
import CreateCategoryPage from "@/pages/CreateCategoryPage";
import AddVariantsPage from "@/pages/AddVariantsPage";
import AdminPage from "@/pages/AdminPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminMyCategoriesPage from "@/pages/AdminMyCategoriesPage";
import AdminMyProductsPage from "@/pages/AdminMyProductsPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/products",
                element: <ProductsPage />,
            },
            {
                path: "/products/:id",
                element: <ProductDetailPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/profile",
                element: <ProfilePage />,
            },
            {
                path: "/admin",
                element: <AdminPage />,
            },
            {
                path: "/admin/products",
                element: <AdminProductsPage />,
            },
            {
                path: "/admin/products/my",
                element: <AdminMyProductsPage />,
            },
            {
                path: "/admin/products/create",
                element: <CreateProductPage />,
            },
            {
                path: "/admin/products/:id/variants",
                element: <AddVariantsPage />,
            },
            {
                path: "/admin/categories/my",
                element: <AdminMyCategoriesPage />,
            },
            {
                path: "/admin/categories/create",
                element: <CreateCategoryPage />,
            },
        ],
    },
]);