"use client";
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

const RoomForm = ({ existingRoom }) => {
    // const router = useRouter();
    const isUpdate = !!existingRoom;

    const initialValues = {
        title: existingRoom?.title || '',
        rent: existingRoom?.rent || '',
        facilities: existingRoom?.facilities || [],
        picture: existingRoom?.picture || ''
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Room title is required'),
        rent: Yup.number().required('Room rent is required').positive('Must be a positive number'),
        facilities: Yup.array().of(Yup.string()).required('At least one facility is required'),
        picture: Yup.string().required('Picture is required')
    });

    const handleSubmit = async (values) => {
        try {
            if (isUpdate) {
                // Update existing room
                await axios.put(`/api/rooms/${existingRoom._id}`, values);
            } else {
                // Create new room
                await axios.post('/api/rooms', values);
            }
            // Redirect to admin dashboard after success
            // router.push('/admin/dashboard');
        } catch (error) {
            console.error('Error saving room:', error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, errors, touched }) => (
                <Form className="order-container flex flex-col space-y-4 w-full">
                    <div>
                        <Field
                            name="title"
                            type="text"
                            required
                            placeholder="Room Title"
                            className="input input-bordered w-full lg:w-[600px]"
                        />
                        <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
                    </div>
                    
                    <div>
                        <Field
                            name="rent"
                            type="number"
                            required
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
                                        <button type="button" className='text-red-600' onClick={() => remove(index)}>Remove</button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-neutral mt-2"
                                    onClick={() => push('')}
                                >
                                    Add New Facility
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    
                    <div className="flex flex-col">
                        <input
                            required
                            name="file"
                            type="file"
                            className="file-input file-input-ghost bg-secondary text-white mb-4 w-full lg:w-[600px]"
                        />
                        <ErrorMessage name="picture" component="div" className="text-red-600 text-sm" />
                    </div>
                    
                    <button className="btn btn-active btn-neutral w-full text-white">
                        {isUpdate ? 'Update Room' : 'Create Room'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default RoomForm;
