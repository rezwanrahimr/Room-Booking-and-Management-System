"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

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

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 font-work-sans">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Our Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length <= 0 ? (
                    <h2 className="text-2xl font-semibold text-primary text-center">
                        No Rooms Available!
                    </h2>
                ) : (
                    rooms.map(room => (
                        <div key={room._id} className="card bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden">
                            <div className="card-body p-16">
                                <h2 className="card-title text-2xl font-bold text-black mb-2">Name: {room.title}</h2>
                                <h3 className="text-black text-lg font-bold">Rent: {room.rent}</h3>
                                <p className="text-black text-lg font-bold mb-3">Facilities:</p>
                                <ul className="list-disc list-inside text-black mb-4 text-lg" >
                                    {room.facilities.map((facility, index) => (
                                        <li className='text-lg font-bold' key={index}>{facility}</li>
                                    ))}
                                </ul>
                                <div className="card-actions flex justify-end">
                                    <Link href={`/user/rooms/${room._id}`}>
                                        <button className="btn bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200" >
                                            View Details
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>


    );
};

export default Rooms;
