"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const token = Cookies.get('token');

    // Decode token to get user role
    let userName = null;
    let userEmail = null;
    let userRole = null;
    if (token) {
        userName = JSON.parse(atob(token.split('.')[1])).name;
        userEmail = JSON.parse(atob(token.split('.')[1])).email;
        userRole = JSON.parse(atob(token.split('.')[1])).role;
    }

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        // Remove token from cookies
        Cookies.remove('token');
        setIsLoggedIn(false);
        router.push('/login');

    };

    const navItems = [
        {
            name: "Home",
            path: "/"
        }

    ];

    if (token) {
        navItems.push({
            name: "Dashboard",
            path: isLoggedIn && userRole === 'admin' ? "/admin/dashboard" : "/user/dashboard"
        })
    }


    if (loading) return null;

    return (
        <div className="navbar bg-sky-600 text-white font-work-sans flex items-center justify-between lg:px-80 text-2xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {
                            navItems.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.path}>{item.name}</Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <Link className="btn btn-ghost text-3xl" href="/">Room Booking</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {
                        navItems.map((item, index) => (
                            <li key={index} className="text-xl">
                                <Link href={item.path}>{item.name}</Link></li>
                        ))
                    }
                </ul>
            </div>
            <div className="navbar-end">







                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-black  rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {
                            token && <li><a>{userName}</a></li>
                        }

                        {isLoggedIn ? (
                            <li><button className="" onClick={handleLogout}>Logout</button></li>
                        ) : (
                            <li><Link className="" href="/login">Login</Link></li>
                        )}
                    </ul>
                </div>

            </div>
        </div >
    );
};

export default Navbar;
