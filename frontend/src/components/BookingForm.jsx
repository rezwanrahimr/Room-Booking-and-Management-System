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
                    axios.get("https://room-booking-and-management-system.vercel.app/api/auth/users", { headers: authHeader() }),
                    axios.get("https://room-booking-and-management-system.vercel.app/api/rooms", { headers: authHeader() })
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

    // Set initial values
    useEffect(() => {
        if (existingBooking) {
            setInitialValues({
                userId: existingBooking.userId || '',
                roomId: existingBooking.roomId._id || '',
                rent: existingBooking.price || 0,
                status: existingBooking.status || '',
                fromDate: existingBooking.fromDate ? existingBooking.fromDate.split('T')[0] : '', 
                toDate: existingBooking.toDate ? existingBooking.toDate.split('T')[0] : ''
            });
        } else {
            setInitialValues({
                userId: '',
                roomId: '',
                rent: 0,
                status: '',
                fromDate: '',  
                toDate: ''  
            });
        }
    }, [existingBooking, users, rooms]);

    const validationSchema = Yup.object({
        userId: Yup.string().required('User is required'),
        roomId: Yup.string().required('Room is required'),
        rent: Yup.number().required('Rent is required').positive('Must be a positive number'),
        status: Yup.string().required('Status is required'),
        fromDate: Yup.date().required('From date is required'),
        toDate: Yup.date().required('To date is required').min(
            Yup.ref('fromDate'),
            'To date must be later than from date'
        )
    });

    const handleSubmit = async (values) => {
        try {
            const formatData = { ...values };
            const response = await axios.put(`https://room-booking-and-management-system.vercel.app/api/booking/${existingBooking._id}`, formatData, { headers: authHeader() });

            if (response.data.status) {
                Swal.fire({
                    icon: 'success',
                    title: `Booking Update Successfully!`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                push('/admin/booking/all');
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

                    <div>
                        <Field
                            name="fromDate"
                            type="date"
                            className="input input-bordered w-full lg:w-[600px]"
                            value={values.fromDate}
                            onChange={e => setFieldValue('fromDate', e.target.value)}
                        />
                        <ErrorMessage name="fromDate" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Field
                            name="toDate"
                            type="date"
                            className="input input-bordered w-full lg:w-[600px]"
                            value={values.toDate}
                            onChange={e => setFieldValue('toDate', e.target.value)}
                        />
                        <ErrorMessage name="toDate" component="div" className="text-red-600 text-sm" />
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
