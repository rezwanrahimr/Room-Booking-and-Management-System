"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { authHeader } from '@/utils';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const RoomForm = ({ existingRoom }) => {

    const [initialValues, setInitialValues] = useState(null);
    const [previewImage, setPreviewImage] = useState({
        file: null,
        initialStatus: false
    });

    const { push } = useRouter();


    const isUpdate = !!existingRoom;

    useEffect(() => {
        // Set the initial values for the form
        if (existingRoom) {
            setInitialValues({
                title: existingRoom?.title || '',
                rent: existingRoom?.rent || '',
                facilities: existingRoom?.facilities || [],
                picture: null,
            });
            setPreviewImage({ file: existingRoom.picture, initialStatus: true });
        } else {
            setInitialValues({
                title: '',
                rent: '',
                facilities: [],
                picture: null,
            });
        }
    }, [existingRoom]);

    const validationSchema = Yup.object({
        title: Yup.string().required('Room title is required'),
        rent: Yup.number().required('Room rent is required').positive('Must be a positive number'),
        facilities: Yup.array().of(Yup.string()).required('At least one facility is required'),
        picture: isUpdate ? Yup.mixed().nullable() : Yup.mixed().required('A picture is required'),
    });

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('rent', values.rent);
        formData.append('facilities', values.facilities);

        if (values.picture) {
            formData.append('picture', values.picture);
        }

        try {
            if (isUpdate) {
                // Update existing room
                const response = await axios.put(`https://room-booking-and-management-system.vercel.app/api/rooms/${existingRoom._id}`, formData, {
                    headers: authHeader(true),
                });

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
                        title: "Room Update Successfully!"
                    });

                    push('/admin/rooms/all');
                }
            } else {
                // Create new room
                const response = await axios.post('https://room-booking-and-management-system.vercel.app/api/rooms', formData, {
                    headers: authHeader(true),
                });

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
                        title: "Room Create Successfully!"
                    });

                    push('/admin/rooms/all');
                }
            }


        } catch (error) {
            console.error('Error saving room:', error);
        }
    };


    const handlePictureChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue('picture', file);

        // Show the preview of the new selected image
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage({ file: reader.result, initialStatus: false });
            };
            reader.readAsDataURL(file);
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
            enableReinitialize // Ensure form reinitializes when initialValues change
        >
            {({ values, setFieldValue }) => (
                <Form className="order-container flex flex-col space-y-4 w-full font-work-sans">
                    <div>
                        <Field
                            name="title"
                            type="text"
                            placeholder="Room Title"
                            className="input input-bordered w-full lg:w-[600px]"
                        />
                        <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Field
                            name="rent"
                            type="number"
                            placeholder="Room Rent"
                            className="input input-bordered w-full lg:w-[600px]"
                        />
                        <ErrorMessage name="rent" component="div" className="text-red-600 text-sm" />
                    </div>

                    <FieldArray name="facilities">
                        {({ push, remove }) => (
                            <div>
                                {values.facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <Field
                                            name={`facilities.${index}`}
                                            placeholder="Facility"
                                            className="input input-bordered w-full lg:w-[600px]"
                                        />
                                        <ErrorMessage name={`facilities.${index}`} component="div" className="text-red-600 text-sm" />
                                        <button type="button" className="text-red-600" onClick={() => remove(index)}>Remove</button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-neutral mt-2 text-white"
                                    onClick={() => push('')}
                                >
                                    Add New Facility
                                </button>
                            </div>
                        )}
                    </FieldArray>

                    <div className="flex flex-col">
                        {previewImage.file && (
                            <div className="mb-4">
                                <img
                                    src={previewImage.initialStatus ? `data:image/jpeg;base64,${previewImage.file}` : previewImage.file}
                                    alt="Room Preview"
                                    className="w-[600px] h-auto"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            name="picture"
                            accept="image/*"
                            className="file-input file-input-ghost bg-sky-600 text-white mb-4 w-full lg:w-[600px]"
                            onChange={(event) => handlePictureChange(event, setFieldValue)}
                        />
                        <ErrorMessage name="picture" component="div" className="text-red-600 text-sm" />
                    </div>

                    <button type="submit" className="btn btn-active btn-neutral w-full text-white">
                        {isUpdate ? 'Update Room' : 'Create Room'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default RoomForm;
