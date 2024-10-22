"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { authHeader } from '@/utils';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const BookingForm = ({ existingBooking }) => {
    const [initialValues, setInitialValues] = useState(null);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const { push } = useRouter();

    const statusList = [
        { value: 'booked', label: 'booked' },
        { value: 'cancelled', label: 'cancelled' }
    ];

    // Fetch Users and Rooms
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, roomsResponse] = await Promise.all([
                    axios.get("http://localhost:5000/api/auth/users", { headers: authHeader() }),
                    axios.get("http://localhost:5000/api/rooms", { headers: authHeader() })
                ]);

                if (usersResponse.data.status) {
                    setUsers(usersResponse.data.data.map(user => ({ value: user._id, label: user.name })));
                }

                setRooms(roomsResponse.data.map(room => ({ value: room._id, label: room.title })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Set initial values based on existing booking
    useEffect(() => {
        if (existingBooking ) {
            setInitialValues({
                userId: users.find(user => { user._id === existingBooking.userId }) || null,
                roomId: rooms.find(room => { room._id === existingBooking.roomId }) || null,
                rent: existingBooking?.rent || '',
                status: statusList.find(status => { status.value === existingBooking.status }) || null,
            });
        }
    }, [existingBooking, users, rooms]);

    const validationSchema = Yup.object({
        userId: Yup.string().required('User is required'),
        roomId: Yup.string().required('Room is required'),
        rent: Yup.number().required('Rent is required').positive('Must be a positive number'),
        status: Yup.string().required('Status is required'),
    });

    const handleSubmit = async (values) => {
        try {
            const formData = { ...values };
            const url = existingBooking
                ? `https://room-booking-and-management-system.vercel.app/api/rooms/${existingBooking._id}`
                : 'https://room-booking-and-management-system.vercel.app/api/rooms';
            const method = existingBooking ? 'put' : 'post';

            const response = await axios[method](url, formData, { headers: authHeader(true) });

            if (response.data.status) {
                Swal.fire({
                    icon: 'success',
                    title: `Booking ${existingBooking ? 'Updated' : 'Created'} Successfully!`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                push('/admin/rooms/all');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!initialValues) {
        return <LoadingSpinner />;
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, setFieldValue }) => (
                <Form className="order-container flex flex-col space-y-4 w-full font-work-sans">
                    <div>
                        <Field
                            as="select"
                            name="userId"
                            className="select select-bordered w-full lg:w-[600px]"
                            value={values.userId}
                            onChange={e => setFieldValue('userId', e.target.value)}
                        >
                            <option value="" label="Select User" />
                            {users.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="userId" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Field
                            as="select"
                            name="roomId"
                            className="select select-bordered w-full lg:w-[600px]"
                            value={values.roomId}
                            onChange={e => setFieldValue('roomId', e.target.value)}
                        >
                            <option value="" label="Select Room" />
                            {rooms.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="roomId" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Field
                            name="rent"
                            type="number"
                            placeholder="Room Rent"
                            className="input input-bordered w-full lg:w-[600px]"
                            value={values.rent}
                            onChange={e => setFieldValue('rent', e.target.value)}
                        />
                        <ErrorMessage name="rent" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Field
                            as="select"
                            name="status"
                            className="select select-bordered w-full lg:w-[600px]"
                            value={values.status}
                            onChange={e => setFieldValue('status', e.target.value)}
                        >
                            <option value="" label="Select Status" />
                            {statusList.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="status" component="div" className="text-red-600 text-sm" />
                    </div>

                    <button type="submit" className="btn btn-active btn-neutral w-full text-white">
                        {existingBooking ? 'Update Booking' : 'Create Booking'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default BookingForm;
