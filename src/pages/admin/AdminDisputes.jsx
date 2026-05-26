import { useEffect, useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const AdminDisputes = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState(null);
    const [resolveData, setResolveData] = useState({
        damageCharges: 0,
        securityDepositStatus: 'Forfeited',
        notes: ''
    });

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/disputes');
            setDisputes(data.disputes);
        } catch (err) {
            toast.error("Failed to fetch disputes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDisputes(); }, []);

    const handleResolve = async (id) => {
        try {
            await axios.put(`/admin/dispute/resolve/${id}`, resolveData);
            toast.success("Dispute resolved successfully");
            setResolvingId(null);
            fetchDisputes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resolve dispute");
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Disputes" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-5xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Dispute Management</h1>

                    {disputes.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiAlertCircle className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No disputes found</h3>
                            <p className="text-gray-400">All rentals are in good standing</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {disputes.map(dispute => (
                                <div key={dispute._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={dispute.product?.images?.[0]?.url || '/placeholder.png'}
                                                alt={dispute.product?.name}
                                                className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{dispute.product?.name}</p>
                                                <p className="text-sm text-gray-500">Customer: {dispute.user?.name}</p>
                                                <p className="text-sm text-gray-500">Vendor: {dispute.vendor?.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${dispute.returnInfo?.condition === 'Damaged' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                            {dispute.returnInfo?.condition}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                                        {[
                                            { label: 'Rental Period', value: `${dispute.rentalTenure} months` },
                                            { label: 'Returned On', value: dispute.returnInfo?.returnedAt ? new Date(dispute.returnInfo.returnedAt).toLocaleDateString() : 'N/A' },
                                            { label: 'Security Deposit', value: `₹${dispute.securityDeposit}` },
                                            { label: 'Deposit Status', value: dispute.securityDepositStatus }
                                        ].map(item => (
                                            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                                                <p className="font-semibold text-gray-800">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {dispute.returnInfo?.notes && (
                                        <p className="text-sm text-gray-600 bg-red-50 rounded-xl p-3 mb-4">
                                            📝 {dispute.returnInfo.notes}
                                        </p>
                                    )}

                                    {/* Resolve Form */}
                                    {resolvingId === dispute._id ? (
                                        <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Damage Charges (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={resolveData.damageCharges}
                                                        onChange={e => setResolveData({ ...resolveData, damageCharges: Number(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 block mb-1">Security Deposit Decision</label>
                                                    <select
                                                        value={resolveData.securityDepositStatus}
                                                        onChange={e => setResolveData({ ...resolveData, securityDepositStatus: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                                    >
                                                        <option value="Forfeited">Forfeit Deposit</option>
                                                        <option value="Refunded">Refund Deposit</option>
                                                        <option value="Held">Keep on Hold</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Resolution Notes</label>
                                                <textarea
                                                    value={resolveData.notes}
                                                    onChange={e => setResolveData({ ...resolveData, notes: e.target.value })}
                                                    placeholder="Add resolution details..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleResolve(dispute._id)}
                                                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <FiCheckCircle /> Resolve Dispute
                                                </button>
                                                <button
                                                    onClick={() => setResolvingId(null)}
                                                    className="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:border-gray-300 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setResolvingId(dispute._id)}
                                            className="flex items-center gap-2 border border-orange-200 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                        >
                                            <FiAlertCircle /> Resolve Dispute
                                        </button>
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

export default AdminDisputes;