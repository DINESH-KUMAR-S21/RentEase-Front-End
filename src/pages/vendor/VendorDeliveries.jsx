import { useEffect, useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiTruck, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const VendorDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('deliveries');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [delRes, pickRes] = await Promise.all([
                axios.get('/vendor/deliveries'),
                axios.get('/vendor/pickups')
            ]);
            setDeliveries(delRes.data.deliveries);
            setPickups(pickRes.data.pickups);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleConfirmDelivery = async (id) => {
        try {
            await axios.put(`/vendor/delivery/confirm/${id}`);
            toast.success("Delivery confirmed!");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to confirm delivery");
        }
    };

    const handleConfirmReturn = async (id) => {
        const condition = window.prompt("Enter product condition (Good / Damaged / Lost):", "Good");
        if (!condition) return;
        try {
            await axios.put(`/vendor/rental/return/${id}`, { condition });
            toast.success("Return confirmed!");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to confirm return");
        }
    };

    if (loading) return <Loader />;

    const currentList = activeTab === 'deliveries' ? deliveries : pickups;

    return (
        <>
            <MetaData title="Deliveries & Pickups" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-5xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Deliveries & Pickups</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { key: 'deliveries', label: `Upcoming Deliveries (${deliveries.length})` },
                            { key: 'pickups', label: `Pending Pickups (${pickups.length})` }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === tab.key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-orange-200'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {currentList.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiTruck className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No {activeTab === 'deliveries' ? 'upcoming deliveries' : 'pending pickups'}
                            </h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentList.map(item => (
                                <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.product?.images?.[0]?.url || '/placeholder.png'}
                                                alt={item.product?.name}
                                                className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.product?.name}</p>
                                                <p className="text-sm text-orange-500">{item.product?.category}</p>
                                            </div>
                                        </div>

                                        {activeTab === 'deliveries' ? (
                                            <button
                                                onClick={() => handleConfirmDelivery(item._id)}
                                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                            >
                                                <FiCheckCircle /> Confirm Delivery
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleConfirmReturn(item._id)}
                                                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                            >
                                                <FiArrowLeft /> Confirm Pickup
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-gray-400 text-xs mb-1">Customer</p>
                                            <p className="font-medium text-gray-800">{item.user?.name}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-gray-400 text-xs mb-1">
                                                {activeTab === 'deliveries' ? 'Delivery Date' : 'Return Requested'}
                                            </p>
                                            <p className="font-medium text-gray-800">
                                                {activeTab === 'deliveries'
                                                    ? new Date(item.deliveryDate).toLocaleDateString()
                                                    : new Date(item.returnInfo?.returnRequestedAt).toLocaleDateString()
                                                }
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-gray-400 text-xs mb-1">Tenure</p>
                                            <p className="font-medium text-gray-800">{item.rentalTenure} months</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-gray-400 text-xs mb-1">Address</p>
                                            <p className="font-medium text-gray-800 text-xs truncate">{item.shippingInfo?.city}, {item.shippingInfo?.state}</p>
                                        </div>
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

export default VendorDeliveries;