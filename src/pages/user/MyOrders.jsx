import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, clearError } from '../../redux/slices/orderSlice';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiPackage, FiCalendar, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
};

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="My Orders" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-4xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">My Orders</h1>

                    {orders?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiPackage className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                            <p className="text-gray-400 mb-6">Your orders will appear here</p>
                            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Order ID</p>
                                            <p className="font-mono text-sm font-medium text-gray-700">{order._id}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.rentalStatus === 'Active' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                                Rental: {order.rentalStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3 mb-4">
                                        {order.orderItems?.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}/month</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="border-t border-gray-50 pt-4 flex flex-wrap justify-between items-center gap-3 text-sm">
                                        <div className="flex gap-4 text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="text-orange-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock className="text-orange-400" />
                                                {order.rentalTenure} months
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-800">₹{order.totalPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default MyOrders;