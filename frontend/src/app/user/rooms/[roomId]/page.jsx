"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { authHeader } from '@/utils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RoomDetail = () => {
    const [room, setRoom] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rooms/${params.roomId}`, { headers: authHeader() });
                setRoom(response.data);
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoom();
    }, [params.roomId]);

    const initialValues = {
        fromDate: '',
        toDate: ''
    };

    const validationSchema = Yup.object().shape({
        fromDate: Yup.string().required('From Date is required'),
        toDate: Yup.string().required('To Date is required'),
    });

    const handleBooking = async (values, { setSubmitting }) => {
        try {
            const bookingData = {
                fromDate: values.fromDate,
                toDate: values.toDate,
                roomId: params.roomId
            };
            // Call the booking API
            await axios.post('http://localhost:5000/api/bookings', bookingData, { headers: authHeader() });
            alert("Booking successful!");
        } catch (error) {
            console.error("Error booking room:", error);
            alert("Failed to book the room. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!room) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4 font-work-sans">
            <div className="card p-16 lg:card-side bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
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
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        {room.facilities.map((facility, index) => (
                            <li key={index}>{facility}</li>
                        ))}
                    </ul>
                    <p className="text-lg font-semibold text-gray-800">
                        Rent: <span className="text-sky-600">${room.rent}</span>
                    </p>

                    {/* Date selection form using Formik */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleBooking}
                    >
                        {({ isSubmitting }) => (
                            <Form className="mt-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="w-full">
                                        <label htmlFor="fromDate" className="block text-gray-600 font-medium mb-1">From Date:</label>
                                        <Field
                                            type="date"
                                            name="fromDate"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                        <ErrorMessage name="fromDate" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="toDate" className="block text-gray-600 font-medium mb-1">To Date:</label>
                                        <Field
                                            type="date"
                                            name="toDate"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                        <ErrorMessage name="toDate" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="btn bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Booking..." : "Book Now"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
