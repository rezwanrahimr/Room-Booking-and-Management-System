"use client";
import AdminLayout from '@/components/AdminLayout';
import RoomForm from '../../../../components/RoomForm';

const NewRoomPage = () => {
    return (
        <AdminLayout>
            <div>
                <h1 className='text-center text-3xl my-5 font-work-sans font-bold'>Create New Room</h1>
                <RoomForm />
            </div>
        </AdminLayout>

    );
};

export default NewRoomPage;
