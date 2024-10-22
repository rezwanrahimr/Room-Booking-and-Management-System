"use client";

import AdminLayout from '@/components/AdminLayout';
import RoomForm from '../../../../../components/RoomForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { authHeader } from '@/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const UpdateBookingPage = () => {
    const [getBooking, setGetBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        async function fetchRoom() {
            const bookingId = params.bookingId;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/booking/${bookingId}`, { headers: authHeader() });
                setGetBooking(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch booking data');
            } finally {
                setLoading(false);
            }
        }

        fetchRoom();
    }, [params.bookingId]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <AdminLayout>
            <div>
                <h1 className='text-center text-3xl my-5 font-work-sans font-bold'>Update Booking</h1>
                {/* <RoomForm existingRoom={getBooking} /> */}
            </div>
        </AdminLayout>
    );
};

export default UpdateBookingPage;