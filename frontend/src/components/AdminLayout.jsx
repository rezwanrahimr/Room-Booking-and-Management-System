"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Make sure this is correct

const AdminLayout = ({ children }) => {
    const router = useRouter();

    // Helper function to check if the link is active
    const isActive = (path) => router.pathname === path;

    return (
        <div className="drawer lg:drawer-open pt-24">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start ps-8 pt-8 bg-slate-100">
                {children}
            </div>
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 h-full bg-white text-base-content font-medium text-base">
                    <li className={isActive('/dashboard') ? 'active' : ''}>
                        <Link href="/dashboard" passHref>
                            Order
                        </Link>
                    </li>
                    <li className={isActive('/dashboard/service') ? 'active' : ''}>
                        <Link href="/dashboard/service" passHref>
                            Service List
                        </Link>
                    </li>
                    <li className={isActive('/dashboard/review') ? 'active' : ''}>
                        <Link href="/dashboard/review" passHref>
                            Review
                        </Link>
                    </li>
                    <li className={isActive('/dashboard/allOrder') ? 'active' : ''}>
                        <Link href="/dashboard/allOrder" passHref>
                            All Orders
                        </Link>
                    </li>
                    <li className={isActive('/dashboard/addService') ? 'active' : ''}>
                        <Link href="/dashboard/addService" passHref>
                            Add Service
                        </Link>
                    </li>
                    <li className={isActive('/dashboard/makeAdmin') ? 'active' : ''}>
                        <Link href="/dashboard/makeAdmin" passHref>
                            Make Admin
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminLayout;
