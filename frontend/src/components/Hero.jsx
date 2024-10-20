'use client';

import BannerImg from "../images/hero_bg.png";
import Image from 'next/image';

const Hero = () => {
    return (
        <div >
            <div
                className="flex flex-col-reverse lg:flex-row-reverse items-center justify-between min-h-screen px-4 lg:px-64 space-y-6 lg:space-y-0 lg:space-x-12"
            >
                <div
                    className="w-full lg:w-1/2 flex justify-center lg:justify-end"
                >
                    <div className="w-full lg:w-auto">
                        <Image src={BannerImg} className="w-full rounded-md lg:w-auto" alt="Room Booking Banner" />
                    </div>
                </div>

                <div
                    className="w-full lg:w-1/2 text-center lg:text-left px-4"
                >
                    <p className="py-4 text-xl font-dm-sans font-bold text-color-primary leading-tight">
                        | Welcome to Room Booking and Management System
                    </p>
                    <h1 className="text-5xl lg:text-7xl font-bold font-work-sans text-color-black leading-tight">
                        Your Perfect Place Awaits
                    </h1>
                    <p className="py-4 text-lg lg:text-xl font-dm-sans leading-relaxed">
                        Discover, book, and manage your dream accommodations seamlessly with our platform. We are committed to making your booking experience as smooth and enjoyable as possible.
                    </p>
                    <button
                        className="btn rounded-full bg-sky-600 text-white text-base mt-4 lg:w-48"
                    >
                        Start Your Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
