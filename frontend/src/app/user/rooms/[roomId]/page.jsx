"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { authHeader } from '@/utils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import LoadingSpinner from '@/components/LoadingSpinner';

const RoomDetail = () => {
    const [room, setRoom] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const params = useParams();
    const { push } = useRouter();


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


    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/booking/room/${params.roomId}`, { headers: authHeader() });
                console.log(response.data);
                if (response.data.data.length) {
                    setIsBooking(true);
                }
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

        const token = Cookies.get('token');
        if (!token) {
            push('/login');
            return;
        }

        try {

            const bookingData = {
                roomId: params.roomId,
                fromDate: values.fromDate,
                toDate: values.toDate,
                price: room.rent
            };

            const url = `http://localhost:5000/api/booking`;
            const response = await axios.post(url, bookingData, { headers: authHeader() });

            if (response.data.status) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Room booked successfully!"
                });

                push('/user/dashboard');
            }
        } catch (error) {
            Swal.fire({
                icon: 'info',
                title: 'Booking failed',
                text: error.response.data.message
            });
        } finally {
            setSubmitting(false);
        }
    }


    if (!room) return <LoadingSpinner />;

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
                                    {
                                        isBooking ? (
                                            <button
                                                className="btn bg-sky-600 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-not-allowed"
                                                disabled
                                            >
                                                Already Booked
                                            </button>
                                        ) : <button
                                            type="submit"
                                            className="btn bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Booking..." : "Book Now"}
                                        </button>
                                    }

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
