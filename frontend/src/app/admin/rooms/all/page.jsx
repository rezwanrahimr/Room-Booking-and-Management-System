"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Swal from 'sweetalert2';
import axios from 'axios';
import { authHeader } from '@/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('https://room-booking-and-management-system.vercel.app/api/rooms');
                if (!response.ok) {
                    throw new Error('Failed to fetch rooms');
                }
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleRoomDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.delete(`https://room-booking-and-management-system.vercel.app/api/rooms/${id}`, { headers: authHeader() });

                if (response.data.status) {
                    Swal.fire("Deleted!", "Room has been deleted.", "success");
                    setRooms(rooms.filter((room) => room._id !== id));
                }
            }
        });
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <AdminLayout><div className="container mx-auto p-4 font-work-sans">
            <h1 className="text-3xl font-bold text-center mb-6">All Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {rooms.length <= 0 ? (
                    <h1 className="text-2xl font-bold text-primary text-center">
                        No Rooms Available! <br />
                        <Link href="/admin/rooms/new" className="text-secondary">
                            Add Room
                        </Link>
                    </h1>
                ) : (
                    rooms.map((room => {
                        return <div key={room._id} className="card p-16 lg:card-side bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out my-5">
                            <figure className="w-full lg:w-1/2">
                                <img
                                    src={`data:image/jpeg;base64,${room.picture}`}
                                    alt={room.title}
                                    className="object-cover h-full w-full rounded-lg"
                                />
                            </figure>
                            <div className="card-body p-16 w-full lg:w-1/2">
                                <h2 className="card-title text-3xl font-bold text-gray-800 mb-4">{room.title}</h2>
                                <p className="text-gray-600 mb-4">{room.description || "No description available for this room."}</p>
                                <p className="text-black text-lg font-bold">Facilities:</p>
                                <ul className="list-disc list-inside text-gray-600">
                                    {room.facilities.map((facility, index) => (
                                        <li key={index}>{facility}</li>
                                    ))}
                                </ul>
                                <p className="text-lg font-semibold text-gray-800">
                                    Rent: <span className="text-sky-600">${room.rent}</span>
                                </p>

                                <div className="flex flex-col md:flex-row gap-4">

                                </div>
                                <div className="card-actions justify-end gap-5 mt-4">
                                    <Link href={`/admin/rooms/update/${room._id}`}><button className='btn bg-sky-600 text-white'>Update</button></Link>
                                    <button className='btn bg-red-600 text-white' onClick={() => handleRoomDelete(room._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    }))
                )}
            </div>
        </div></AdminLayout>

    );
};

export default Rooms;
