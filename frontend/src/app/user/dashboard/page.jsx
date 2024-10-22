import UserLayout from "@/components/UserLayout";
import Link from "next/link";

const UserDashboard = () => {
    return (
        <UserLayout>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard!</h1>
                <Link href="/user/dashboard/booking" className="underline underline-offset-4">See Your Booking History</Link>
            </div>
        </UserLayout>
    );
};

export default UserDashboard;
