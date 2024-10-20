// pages/rooms.js
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/rooms'); // Adjust the URL if needed
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <AdminLayout><div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Available Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.length <= 0 ? (
                    <h1 className="text-2xl font-bold text-primary text-center">
                        No Rooms Available! <br />
                        <Link href="/add-room" className="text-secondary">
                            Add Room
                        </Link>
                    </h1>
                ) : (
                    rooms.map(room => (
                        <div key={room._id} className="card bg-base-100 w-96 shadow-xl">
                            <figure>
                                <Image
                                    src={`data:image/jpeg;base64,${room.picture}`}
                                    width={300}
                                    height={250}
                                    alt={room.title} />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {room.title}
                                    <div className="badge badge-secondary">Avilable</div>
                                </h2>
                                <p>Facilities: {room.facilities.join(', ')}</p>
                                <p>Rent: ${room.rent}</p>
                                <div className="card-actions justify-end">
                                    <div className="badge badge-outline ">Update</div>
                                    <div className="badge badge-outline bg-red-600 text-white">Delete</div>
                                </div>
                            </div>
                        </div>

                    ))
                )}
            </div>
        </div></AdminLayout>

    );
};

export default Rooms;
