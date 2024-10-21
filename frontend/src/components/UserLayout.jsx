"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserLayout = ({ children }) => {
    const router = useRouter();

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
                    <li className={isActive('/user/dashboard/booking') ? 'active' : ''}>
                        <Link href="/user/dashboard/booking" passHref>
                            Bookings
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserLayout;
