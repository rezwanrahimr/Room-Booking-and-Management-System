"use client";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <h2 className="text-2xl font-semibold mb-5">Welcome to the Admin Dashboard</h2>
            <p>Your management tools are ready to use.</p>
            {/* Add dashboard content here */}
        </AdminLayout>
    );
};

export default AdminDashboard;
