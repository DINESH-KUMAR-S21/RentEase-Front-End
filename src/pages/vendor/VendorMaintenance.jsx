import { useEffect, useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiTool, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Acknowledged: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    Resolved: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-600'
};

const VendorMaintenance = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState(null);
    const [responseData, setResponseData] = useState({
        status: '', message: '', technicianName: '',
        technicianPhone: '', scheduledDate: ''
    });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/vendor/maintenance');
            setRequests(data.requests);
            setStats(data.stats);
        } catch (err) {
            toast.error("Failed to fetch maintenance requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleRespond = async (id) => {
        try {
            await axios.put(`/vendor/maintenance/${id}`, responseData);
            toast.success("Request updated successfully");
            setRespondingId(null);
            setResponseData({ status: '', message: '', technicianName: '', technicianPhone: '', scheduledDate: '' });
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update request");
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Vendor Maintenance" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-5xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Maintenance Requests</h1>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Pending', value: stats.pending || 0, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
                            { label: 'In Progress', value: stats.inProgress || 0, color: 'bg-orange-50 text-orange-700 border-orange-100' },
                            { label: 'Resolved', value: stats.resolved || 0, color: 'bg-green-50 text-green-700 border-green-100' }
                        ].map(stat => (
                            <div key={stat.label} className={`rounded-2xl border p-5 text-center ${stat.color}`}>
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm font-medium mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Requests */}
                    {requests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiTool className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No maintenance requests</h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={req.product?.images?.[0]?.url || '/placeholder.png'}
                                                alt={req.product?.name}
                                                className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{req.product?.name}</p>
                                                <p className="text-sm text-orange-500">{req.issueType}</p>
                                                <p className="text-xs text-gray-400">From: {req.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status]}`}>
                                                {req.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.priority === 'High' ? 'bg-red-100 text-red-700' : req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {req.priority}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4">{req.description}</p>

                                    {/* Response Form */}
                                    {respondingId === req._id ? (
                                        <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Update Status</label>
                                                    <select
                                                        value={responseData.status}
                                                        onChange={e => setResponseData({ ...responseData, status: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    >
                                                        <option value="">Select status...</option>
                                                        {["Acknowledged", "In Progress", "Resolved", "Closed"].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Scheduled Date</label>
                                                    <input
                                                        type="date"
                                                        value={responseData.scheduledDate}
                                                        onChange={e => setResponseData({ ...responseData, scheduledDate: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Technician Name</label>
                                                    <input
                                                        type="text"
                                                        value={responseData.technicianName}
                                                        onChange={e => setResponseData({ ...responseData, technicianName: e.target.value })}
                                                        placeholder="Technician name"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Technician Phone</label>
                                                    <input
                                                        type="text"
                                                        value={responseData.technicianPhone}
                                                        onChange={e => setResponseData({ ...responseData, technicianPhone: e.target.value })}
                                                        placeholder="Phone number"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Response Message</label>
                                                <textarea
                                                    value={responseData.message}
                                                    onChange={e => setResponseData({ ...responseData, message: e.target.value })}
                                                    placeholder="Write a response to the customer..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRespond(req._id)}
                                                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <FiCheckCircle /> Submit Response
                                                </button>
                                                <button
                                                    onClick={() => setRespondingId(null)}
                                                    className="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:border-gray-300 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                            {req.status !== 'Resolved' && req.status !== 'Closed' && (
                                                <button
                                                    onClick={() => setRespondingId(req._id)}
                                                    className="flex items-center gap-2 border border-orange-200 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <FiTool /> Respond
                                                </button>
                                            )}
                                        </div>
                                    )}
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

export default VendorMaintenance;