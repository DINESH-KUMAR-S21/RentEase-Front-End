import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/dashboard/StatCard';
import {
    FiPackage, FiTruck, FiTool, FiDollarSign,
    FiArrowRight, FiBox, FiRefreshCw
} from 'react-icons/fi';

const VendorDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await axios.get('/vendor/dashboard');
                setDashboard(data.dashboard);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Vendor Dashboard" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-7xl w-full">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome back, <span className="text-orange-500">{user?.name}</span> 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Here's what's happening with your inventory</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Products" value={dashboard?.totalProducts || 0} icon={<FiPackage />} color="orange" />
                        <StatCard title="Available Products" value={dashboard?.availableProducts || 0} icon={<FiBox />} color="green" />
                        <StatCard title="Rented Out" value={dashboard?.rentedProducts || 0} icon={<FiRefreshCw />} color="blue" />
                        <StatCard title="Total Revenue" value={`₹${dashboard?.totalRevenue || 0}`} icon={<FiDollarSign />} color="purple" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Monthly Revenue" value={`₹${dashboard?.monthlyRevenue || 0}`} icon={<FiDollarSign />} color="green" />
                        <StatCard title="Active Rentals" value={dashboard?.activeRentals || 0} icon={<FiRefreshCw />} color="orange" />
                        <StatCard title="Pending Pickups" value={dashboard?.pendingReturns || 0} icon={<FiTruck />} color="red" />
                        <StatCard title="Maintenance Requests" value={dashboard?.maintenanceRequests || 0} icon={<FiTool />} color="blue" />
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { to: '/vendor/products', label: 'Manage Products', icon: <FiPackage />, color: 'bg-orange-500' },
                            { to: '/vendor/deliveries', label: 'Deliveries & Pickups', icon: <FiTruck />, color: 'bg-blue-500' },
                            { to: '/vendor/maintenance', label: 'Maintenance', icon: <FiTool />, color: 'bg-green-500' },
                            { to: '/rentals/me', label: 'My Rentals', icon: <FiRefreshCw />, color: 'bg-purple-500' },
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md p-5 flex items-center justify-between transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default VendorDashboard;