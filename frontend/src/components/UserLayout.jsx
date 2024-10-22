"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const UserLayout = ({ children }) => {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className="drawer lg:drawer-open font-work-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col  justify-start ps-8 pt-8 bg-slate-100">
                {children}
            </div>
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 h-full bg-white text-base-content font-medium text-base">
                    <li className={isActive('/user/dashboard/booking') ? 'bg-sky-200 rounded' : ''}>
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
