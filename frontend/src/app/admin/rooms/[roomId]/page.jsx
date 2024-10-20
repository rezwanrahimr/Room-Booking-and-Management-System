"use client";
// Example RoomDetail.js page in your Next.js application
import { useEffect, useState } from 'react';
import axios from 'axios';

const RoomDetail = ({  }) => {
    const roomId = '6714c85394c7c256d0952992'
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
            setRoom(response.data);
        };

        fetchRoom();
    }, [roomId]);

    if (!room) return <p>Loading...</p>;

    return (
        <div>
            <h1>{room.title}</h1>
            <p>Rent: ${room.rent}</p>
            <p>Facilities: {room.facilities.join(', ')}</p>
            {room.picture && (
                <img src={`http://localhost:5000/uploads/${room.picture.split('/').pop()}`} alt={room.title} />
            )}
        </div>
    );
};

export default RoomDetail;
