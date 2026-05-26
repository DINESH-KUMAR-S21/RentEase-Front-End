import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetAllRentals, adminUpdateRentalStatus, clearError, clearMessage } from '../../redux/slices/rentalSlice';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiSearch, FiRefreshCw, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Overdue: 'bg-red-100 text-red-700',
    Returned: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700'
};

const AdminRentals = () => {
    const dispatch = useDispatch();
    const { rentals, loading, error, message } = useSelector(state => state.rental);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => { dispatch(adminGetAllRentals()); }, [dispatch]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); setEditingId(null); dispatch(adminGetAllRentals()); }
    }, [error, message, dispatch]);

    const handleUpdate = (id) => {
        dispatch(adminUpdateRentalStatus({ id, rentalStatus: newStatus }));
    };

    const filtered = rentals?.filter(r => {
        const matchSearch = r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           r.user?.name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || r.rentalStatus === filter;
        return matchSearch && matchFilter;
    });

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Admin Rentals" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-7xl w-full">

                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Rental Management</h1>
                        <div className="flex gap-3">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search rentals..."
                                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm w-56"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                            >
                                {['All', 'Active', 'Completed', 'Overdue', 'Returned', 'Cancelled'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filtered?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiRefreshCw className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No rentals found</h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered?.map(rental => (
                                <div key={rental._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={rental.product?.images?.[0]?.url || '/placeholder.png'}
                                                alt={rental.product?.name}
                                                className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{rental.product?.name}</p>
                                                <p className="text-sm text-gray-500">Customer: {rental.user?.name}</p>
                                                <p className="text-sm text-gray-500">Vendor: {rental.vendor?.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {editingId === rental._id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={newStatus}
                                                        onChange={e => setNewStatus(e.target.value)}
                                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                                                    >
                                                        {['Active', 'Completed', 'Overdue', 'Returned', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <button onClick={() => handleUpdate(rental._id)} className="text-green-500 text-sm font-medium hover:text-green-700">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm hover:text-gray-600">✕</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[rental.rentalStatus]}`}>
                                                        {rental.rentalStatus}
                                                    </span>
                                                    <button
                                                        onClick={() => { setEditingId(rental._id); setNewStatus(rental.rentalStatus); }}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                                        {[
                                            { label: 'Start', value: new Date(rental.rentalStartDate).toLocaleDateString() },
                                            { label: 'End', value: new Date(rental.rentalEndDate).toLocaleDateString() },
                                            { label: 'Tenure', value: `${rental.rentalTenure} months` },
                                            { label: 'Revenue', value: `₹${rental.totalRentalPrice}` }
                                        ].map(item => (
                                            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                                                <p className="font-semibold text-gray-800">{item.value}</p>
                                            </div>
                                        ))}
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

export default AdminRentals;