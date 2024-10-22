"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Swal from 'sweetalert2';
import axios from 'axios';
import { authHeader } from '@/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const Bookings = () => {
    const [count, setCount] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchbookings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/booking/admin', { headers: authHeader() });
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchbookings();
    }, [count]);

    const handleRoomDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Cancel Booking",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.put(`http://localhost:5000/api/booking/cancel/${id}`, {}, { headers: authHeader() });

                if (!response.ok) {
                    throw new Error('Failed to cancel booking');
                }

                Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
                setCount(count + 1);
            }
        });
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    console.log(bookings);

    return (
        <AdminLayout><div className="container mx-auto p-4 font-work-sans">
            <h1 className="text-3xl font-bold text-center mb-6">All bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {bookings.length <= 0 ? (
                    <h1 className="text-2xl font-bold text-primary text-center">
                        No bookings Available! <br />
                        <Link href="/admin/bookings/new" className="text-secondary">
                            Add Room
                        </Link>
                    </h1>
                ) : (
                    bookings.map((booking => {
                        return <div key={booking._id} className="card p-16 lg:card-side bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out my-5">
                            <figure className="w-full lg:w-1/2">
                                <img
                                    src={`data:image/jpeg;base64,${booking.roomId.picture}`}
                                    alt={booking.roomId.title}
                                    className="object-cover h-full w-full rounded-lg"
                                />
                            </figure>
                            <div className="card-body p-16 w-full lg:w-1/2">
                                <h2 className="card-title text-3xl font-bold text-gray-800 mb-4  font-work-sans">Customer Name: {booking.userId.name}</h2>
                                <h2 className="card-title text-3xl font-bold text-gray-800 mb-4">{booking.roomId.title}</h2>
                                <p className="text-gray-600 mb-4">{booking.roomId.description || "No description available for this room."}</p>
                                <p className="text-black text-lg font-bold">Facilities:</p>
                                <ul className="list-disc list-inside text-gray-600">
                                    {booking.roomId.facilities.map((facility, index) => (
                                        <li key={index}>{facility}</li>
                                    ))}
                                </ul>
                                <p className="text-lg font-semibold text-gray-800">
                                    Rent: <span className="text-sky-600">${booking.roomId.rent}</span>
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    Status: <span className="text-sky-600">{booking.status}</span>
                                </p>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="w-full">
                                        <label htmlFor="fromDate" className="block text-gray-600 font-medium mb-1">From Date:</label>
                                        <input
                                            type="date"
                                            name="fromDate"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            value={new Date(booking.fromDate).toISOString().split('T')[0]}
                                            disabled
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="toDate" className="block text-gray-600 font-medium mb-1">To Date:</label>
                                        <input
                                            type="date"
                                            name="toDate"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            value={new Date(booking.toDate).toISOString().split('T')[0]}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="card-actions justify-end gap-5 mt-4">
                                    <Link href={`/admin/booking/update/${booking._id}`}><button className='btn bg-sky-600 text-white'>Update</button></Link>
                                    {booking.status !== "cancelled" && <button className='btn bg-red-600 text-white' onClick={() => handleRoomDelete(booking._id)}>Cencel Booking</button>}
                                </div>
                            </div>
                        </div>
                    }))
                )}
            </div>
        </div></AdminLayout>

    );
};

export default Bookings;
