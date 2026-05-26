import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyActiveRentals, getMyRentalHistory, extendRental, requestReturn, clearError, clearMessage } from '../../redux/slices/rentalSlice';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiHome, FiCalendar, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Overdue: 'bg-red-100 text-red-700',
    Returned: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700'
};

const MyRentals = () => {
    const dispatch = useDispatch();
    const { rentals, loading, error, message } = useSelector(state => state.rental);
    const [activeTab, setActiveTab] = useState('active');
    const [extendMonths, setExtendMonths] = useState(1);
    const [extendingId, setExtendingId] = useState(null);

    useEffect(() => {
        if (activeTab === 'active') dispatch(getMyActiveRentals());
        else dispatch(getMyRentalHistory());
    }, [dispatch, activeTab]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); setExtendingId(null); }
    }, [error, message, dispatch]);

    const handleExtend = (id) => {
        dispatch(extendRental({ id, additionalMonths: extendMonths }));
    };

    const handleReturn = (id) => {
        if (window.confirm("Are you sure you want to request a return?")) {
            dispatch(requestReturn(id));
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="My Rentals" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-4xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">My Rentals</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {['active', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-orange-200'}`}
                            >
                                {tab === 'active' ? 'Active Rentals' : 'Rental History'}
                            </button>
                        ))}
                    </div>

                    {rentals?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiHome className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === 'active' ? 'No active rentals' : 'No rental history'}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {activeTab === 'active' ? 'Start renting today!' : 'Your completed rentals will appear here'}
                            </p>
                            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rentals.map(rental => (
                                <div key={rental._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={rental.product?.images?.[0]?.url || '/placeholder.png'}
                                                alt={rental.product?.name}
                                                className="w-16 h-16 rounded-xl object-cover bg-gray-50"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{rental.product?.name}</p>
                                                <p className="text-sm text-orange-500">{rental.product?.category}</p>
                                                <p className="text-sm text-gray-500">₹{rental.monthlyPrice}/month</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[rental.rentalStatus]}`}>
                                            {rental.rentalStatus}
                                        </span>
                                    </div>

                                    {/* Rental Details */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                                        {[
                                            { label: 'Start Date', value: new Date(rental.rentalStartDate).toLocaleDateString() },
                                            { label: 'End Date', value: new Date(rental.rentalEndDate).toLocaleDateString() },
                                            { label: 'Tenure', value: `${rental.rentalTenure} months` },
                                            { label: 'Total', value: `₹${rental.totalRentalPrice}` }
                                        ].map(item => (
                                            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                                                <p className="font-semibold text-gray-800">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions for active rentals */}
                                    {rental.rentalStatus === 'Active' && (
                                        <div className="border-t border-gray-50 pt-4 flex flex-wrap gap-3">
                                            {/* Extend */}
                                            {extendingId === rental._id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={extendMonths}
                                                        onChange={e => setExtendMonths(Number(e.target.value))}
                                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                                                    >
                                                        {[1, 2, 3, 6].map(m => (
                                                            <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleExtend(rental._id)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setExtendingId(null)}
                                                        className="border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg text-sm hover:border-gray-300 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setExtendingId(rental._id)}
                                                    className="flex items-center gap-2 border border-orange-200 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    <FiRefreshCw /> Extend Rental
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleReturn(rental._id)}
                                                className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                            >
                                                <FiArrowLeft /> Request Return
                                            </button>
                                        </div>
                                    )}

                                    {/* Return info for returned rentals */}
                                    {rental.returnInfo?.returnedAt && (
                                        <div className="border-t border-gray-50 pt-4 text-sm text-gray-500">
                                            <p>Returned: {new Date(rental.returnInfo.returnedAt).toLocaleDateString()}</p>
                                            <p>Condition: <span className={`font-medium ${rental.returnInfo.condition === 'Good' ? 'text-green-600' : 'text-red-500'}`}>{rental.returnInfo.condition}</span></p>
                                            <p>Deposit: <span className={`font-medium ${rental.securityDepositStatus === 'Refunded' ? 'text-green-600' : 'text-red-500'}`}>{rental.securityDepositStatus}</span></p>
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

export default MyRentals;