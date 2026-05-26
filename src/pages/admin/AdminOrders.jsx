import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetAllOrders, adminUpdateOrder, adminDeleteOrder, clearError, clearMessage } from '../../redux/slices/orderSlice';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiSearch, FiTrash2, FiEdit2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
};

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error, message, totalRevenue } = useSelector(state => state.order);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        dispatch(adminGetAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); setEditingId(null); dispatch(adminGetAllOrders()); }
    }, [error, message, dispatch]);

    const handleUpdateStatus = (id) => {
        dispatch(adminUpdateOrder({ id, orderData: { orderStatus: newStatus } }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this order?")) dispatch(adminDeleteOrder(id));
    };

    const filteredOrders = orders?.filter(o =>
        o._id.includes(search) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Admin Orders" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-7xl w-full">

                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Total Revenue: <span className="font-bold text-orange-500">₹{totalRevenue?.toLocaleString()}</span></p>
                        </div>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by order ID or user..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm w-72"
                            />
                        </div>
                    </div>

                    {filteredOrders?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No orders found</h3>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            {['Order ID', 'Customer', 'Items', 'Total', 'Rental', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredOrders?.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{order._id?.slice(-8)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <p className="font-medium text-gray-800">{order.user?.name}</p>
                                                    <p className="text-gray-400 text-xs">{order.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{order.orderItems?.length}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">₹{order.totalPrice}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{order.rentalTenure}m</td>
                                                <td className="px-6 py-4">
                                                    {editingId === order._id ? (
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={newStatus}
                                                                onChange={e => setNewStatus(e.target.value)}
                                                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                                                            >
                                                                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                            <button onClick={() => handleUpdateStatus(order._id)} className="text-green-500 text-xs font-medium hover:text-green-700">Save</button>
                                                            <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs hover:text-gray-600">✕</button>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { setEditingId(order._id); setNewStatus(order.orderStatus); }}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(order._id)}
                                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default AdminOrders;