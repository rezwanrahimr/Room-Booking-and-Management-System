"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { authHeader } from '@/utils';
import * as Yup from 'yup';
import UserLayout from '@/components/UserLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const Bookings = () => {
    const [room, setRoom] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`https://room-booking-and-management-system.vercel.app/api/booking`, { headers: authHeader() });
                setRoom(response.data);
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoom();
    }, []);

    const handleBooking = async (values, { setSubmitting }) => {
        try {
            const bookingData = {
                roomId: params.roomId,
                fromDate: values.fromDate,
                toDate: values.toDate,
                price: room.rent
            };
            // Call the booking API
            await axios.post('https://room-booking-and-management-system.vercel.app/api/booking', bookingData, { headers: authHeader() });
            alert("Booking successful!");
        } catch (error) {
            console.error("Error booking room:", error);
            alert("Failed to book the room. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!room) return <LoadingSpinner />;

    return (
        <UserLayout><div className="container mx-auto p-4 font-work-sans">
            {
                room.map((booking => {
                    return <div key={booking._id} className="card p-16 lg:card-side bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out my-5">
                        <figure className="w-full lg:w-1/2">
                            <img
                                src={`data:image/jpeg;base64,${booking.roomId.picture}`}
                                alt={booking.roomId.title}
                                className="object-cover h-full w-full rounded-lg"
                            />
                        </figure>
                        <div className="card-body p-16 w-full lg:w-1/2">
                            <h2 className="card-title text-3xl font-bold text-gray-800 mb-4">{booking.roomId.title}</h2>
                            <p className="text-gray-600 mb-4">{booking.roomId.description || "No description available for this room."}</p>
                            <p className="text-black text-lg font-bold">Facilities:</p>
                            <ul className="list-disc list-inside text-gray-600 mb-4">
                                {booking.roomId.facilities.map((facility, index) => (
                                    <li key={index}>{facility}</li>
                                ))}
                            </ul>
                            <p className="text-lg font-semibold text-gray-800">
                                Rent: <span className="text-sky-600">${booking.roomId.rent}</span>
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
                            <div className="card-actions justify-end mt-4">
                                <button
                                    type="submit"
                                    className="btn bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    {booking.status}
                                </button>
                            </div>
                        </div>
                    </div>
                }))
            }
        </div></UserLayout>

    );
};

export default Bookings;
