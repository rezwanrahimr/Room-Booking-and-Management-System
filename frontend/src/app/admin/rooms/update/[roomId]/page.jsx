"use client";

import AdminLayout from '@/components/AdminLayout';
import RoomForm from '../../../../../components/RoomForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { authHeader } from '@/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const UpdateRoomPage = () => {
    const [getRoom, setGetRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        async function fetchRoom() {
            const roomId = params.roomId;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`, { headers: authHeader() });
                setGetRoom(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch room data');
            } finally {
                setLoading(false);
            }
        }

        fetchRoom();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <AdminLayout>
            <div>
                <h1 className='text-center text-3xl my-5 font-work-sans font-bold'>Update Room</h1>
                <RoomForm existingRoom={getRoom} /> {/* Pass the room data to the form */}
            </div>
        </AdminLayout>
    );
};

export default UpdateRoomPage;
