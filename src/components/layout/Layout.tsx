import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    return (
        <div className="min-h-screen bg-white text-foreground">
            {!isHome && <Navbar />}
            <main>
                <Outlet />
            </main>
        </div>
    )
}
