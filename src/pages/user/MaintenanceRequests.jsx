import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMyMaintenanceRequests,
    createMaintenanceRequest,
    cancelMaintenanceRequest,
    clearError, clearMessage
} from '../../redux/slices/maintenanceSlice';
import { getMyActiveRentals } from '../../redux/slices/rentalSlice';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiTool, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Acknowledged: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    Resolved: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-600'
};

const issueTypes = ["Not Working", "Physical Damage", "Missing Parts", "Installation Issue", "Other"];

const MaintenanceRequests = () => {
    const dispatch = useDispatch();
    const { requests, loading, error, message } = useSelector(state => state.maintenance);
    const { rentals } = useSelector(state => state.rental);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rentalId: '', issueType: '', description: '' });

    useEffect(() => {
        dispatch(getMyMaintenanceRequests());
        dispatch(getMyActiveRentals());
    }, [dispatch]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) {
            toast.success(message);
            dispatch(clearMessage());
            setShowForm(false);
            setFormData({ rentalId: '', issueType: '', description: '' });
            dispatch(getMyMaintenanceRequests());
        }
    }, [error, message, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createMaintenanceRequest(formData));
    };

    const handleCancel = (id) => {
        if (window.confirm("Cancel this maintenance request?")) {
            dispatch(cancelMaintenanceRequest(id));
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Maintenance Requests" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-4xl w-full">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                            {showForm ? <FiX /> : <FiPlus />}
                            {showForm ? 'Cancel' : 'New Request'}
                        </button>
                    </div>

                    {/* New Request Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                            <h2 className="font-bold text-gray-800 mb-5">Raise Maintenance Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Rental Select */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Select Active Rental</label>
                                    <select
                                        value={formData.rentalId}
                                        onChange={e => setFormData({ ...formData, rentalId: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                    >
                                        <option value="">Select a rental...</option>
                                        {rentals?.map(rental => (
                                            <option key={rental._id} value={rental._id}>
                                                {rental.product?.name} (since {new Date(rental.rentalStartDate).toLocaleDateString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Issue Type */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Issue Type</label>
                                    <select
                                        value={formData.issueType}
                                        onChange={e => setFormData({ ...formData, issueType: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                    >
                                        <option value="">Select issue type...</option>
                                        {issueTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Description <span className="text-gray-400 text-xs">(max 500 chars)</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the issue in detail..."
                                        rows={4}
                                        maxLength={500}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400 text-right mt-1">{formData.description.length}/500</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Requests List */}
                    {requests?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiTool className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No maintenance requests</h3>
                            <p className="text-gray-400">Raise a request if you face any issues with your rented items</p>
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

                                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">{req.description}</p>

                                    {/* Vendor Response */}
                                    {req.vendorResponse?.message && (
                                        <div className="bg-orange-50 rounded-xl p-4 mb-4 text-sm">
                                            <p className="font-medium text-gray-700 mb-1">Vendor Response:</p>
                                            <p className="text-gray-600">{req.vendorResponse.message}</p>
                                            {req.scheduledDate && (
                                                <p className="text-orange-600 mt-1 font-medium">
                                                    Scheduled: {new Date(req.scheduledDate).toLocaleDateString()}
                                                </p>
                                            )}
                                            {req.vendorResponse.technicianName && (
                                                <p className="text-gray-500 mt-1">
                                                    Technician: {req.vendorResponse.technicianName} — {req.vendorResponse.technicianPhone}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                                        {['Pending', 'Acknowledged'].includes(req.status) && (
                                            <button
                                                onClick={() => handleCancel(req._id)}
                                                className="text-red-400 hover:text-red-600 font-medium transition-colors"
                                            >
                                                Cancel Request
                                            </button>
                                        )}
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

export default MaintenanceRequests;