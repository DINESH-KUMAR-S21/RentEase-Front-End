import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/dashboard/StatCard';
import axios from '../../utils/axios';
import {
    FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
    FiTool, FiMapPin, FiAlertCircle, FiArrowRight,
    FiTruck, FiRefreshCw
} from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, analyticsRes] = await Promise.all([
                    axios.get('/admin/dashboard'),
                    axios.get('/admin/analytics/revenue')
                ]);
                setDashboard(dashRes.data.dashboard);
                setAnalytics(analyticsRes.data.analytics);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = analytics.map(item => ({
        month: monthNames[item.month - 1],
        revenue: item.revenue,
        rentals: item.count
    }));

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Admin Dashboard" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-7xl w-full">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Overview of your entire platform</p>
                    </div>

                    {/* Stats Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard
                            title="Total Users"
                            value={dashboard?.totalUsers || 0}
                            icon={<FiUsers />}
                            color="blue"
                            subtitle="Registered customers"
                        />
                        <StatCard
                            title="Total Vendors"
                            value={dashboard?.totalVendors || 0}
                            icon={<FiUsers />}
                            color="orange"
                            subtitle="Active vendors"
                        />
                        <StatCard
                            title="Total Products"
                            value={dashboard?.totalProducts || 0}
                            icon={<FiPackage />}
                            color="purple"
                            subtitle="Listed products"
                        />
                        <StatCard
                            title="Total Orders"
                            value={dashboard?.totalOrders || 0}
                            icon={<FiShoppingBag />}
                            color="green"
                            subtitle="All time orders"
                        />
                    </div>

                    {/* Stats Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Revenue"
                            value={`₹${dashboard?.totalRevenue?.toLocaleString() || 0}`}
                            icon={<FiDollarSign />}
                            color="green"
                            subtitle="All time"
                        />
                        <StatCard
                            title="Monthly Revenue"
                            value={`₹${dashboard?.monthlyRevenue?.toLocaleString() || 0}`}
                            icon={<FiDollarSign />}
                            color="orange"
                            subtitle="This month"
                        />
                        <StatCard
                            title="Active Rentals"
                            value={dashboard?.activeRentals || 0}
                            icon={<FiRefreshCw />}
                            color="blue"
                            subtitle="Currently rented"
                        />
                        <StatCard
                            title="Overdue Rentals"
                            value={dashboard?.overdueRentals || 0}
                            icon={<FiAlertCircle />}
                            color="red"
                            subtitle="Need attention"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-800 mb-6">Revenue This Year</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, 'Revenue']}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#f97316', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Rentals Chart */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-800 mb-6">Rentals Per Month</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value) => [value, 'Rentals']}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
                                    />
                                    <Bar dataKey="rentals" fill="#f97316" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { to: '/admin/users', label: 'Manage Users', icon: <FiUsers />, color: 'bg-blue-500', sub: `${dashboard?.totalUsers} users` },
                            { to: '/admin/orders', label: 'Manage Orders', icon: <FiShoppingBag />, color: 'bg-green-500', sub: `${dashboard?.totalOrders} orders` },
                            { to: '/admin/rentals', label: 'Manage Rentals', icon: <FiRefreshCw />, color: 'bg-orange-500', sub: `${dashboard?.activeRentals} active` },
                            { to: '/admin/locations', label: 'Manage Locations', icon: <FiMapPin />, color: 'bg-purple-500', sub: `${dashboard?.totalLocations} cities` },
                            { to: '/admin/disputes', label: 'Disputes', icon: <FiAlertCircle />, color: 'bg-red-500', sub: 'Damage claims' },
                            { to: '/admin/maintenance', label: 'Maintenance', icon: <FiTool />, color: 'bg-yellow-500', sub: `${dashboard?.pendingMaintenance} pending` },
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md p-5 flex items-center justify-between transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.label}</p>
                                        <p className="text-xs text-gray-400">{item.sub}</p>
                                    </div>
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

export default AdminDashboard;