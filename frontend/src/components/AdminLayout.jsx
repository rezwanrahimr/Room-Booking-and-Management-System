"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className="drawer lg:drawer-open font-work-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start ps-8 pt-8 bg-slate-100">
                {children}
            </div>
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60  h-full bg-white text-base-content font-medium text-base">

                    <li className={isActive('/admin/rooms/new') ? 'bg-sky-200 rounded' : ''}>
                        <Link href="/admin/rooms/new" passHref>
                            Create New Room
                        </Link>
                    </li>
                    <li className={isActive('/admin/rooms/all') ? 'bg-sky-200 rounded' : ''}>
                        <Link href="/admin/rooms/all" passHref>
                            All Rooms
                        </Link>
                    </li>
                    <li className={isActive('/admin/booking/all') ? 'bg-sky-200 rounded' : ''}>
                        <Link href="/admin/booking/all" passHref>
                            All Bookings
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminLayout;
