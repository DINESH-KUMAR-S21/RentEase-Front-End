import { useEffect, useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const emptyForm = {
    city: '', state: '', country: 'India',
    pincodes: '', deliveryCharges: 0,
    estimatedDeliveryDays: 3, isServiceable: true
};

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/locations');
            setLocations(data.locations);
        } catch (err) {
            toast.error("Failed to fetch locations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleChange = e => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                pincodes: formData.pincodes.toString().split(',').map(p => Number(p.trim())).filter(Boolean)
            };
            if (editingId) {
                await axios.put(`/admin/location/${editingId}`, payload);
                toast.success("Location updated");
            } else {
                await axios.post('/admin/location/new', payload);
                toast.success("Location added");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);
            fetchLocations();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (loc) => {
        setEditingId(loc._id);
        setFormData({
            ...loc,
            pincodes: loc.pincodes?.join(', ')
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this location?")) return;
        try {
            await axios.delete(`/admin/location/${id}`);
            toast.success("Location deleted");
            fetchLocations();
        } catch (err) {
            toast.error("Failed to delete location");
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Manage Locations" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-5xl w-full">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
                        <button
                            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                            {showForm ? <FiX /> : <FiPlus />}
                            {showForm ? 'Close' : 'Add Location'}
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                            <h2 className="font-bold text-gray-800 mb-5">{editingId ? 'Edit Location' : 'Add New Location'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'City', name: 'city', placeholder: 'Chennai' },
                                        { label: 'State', name: 'state', placeholder: 'Tamil Nadu' },
                                        { label: 'Country', name: 'country', placeholder: 'India' },
                                        { label: 'Delivery Charges (₹)', name: 'deliveryCharges', type: 'number', placeholder: '0' },
                                        { label: 'Estimated Delivery Days', name: 'estimatedDeliveryDays', type: 'number', placeholder: '3' }
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                            />
                                        </div>
                                    ))}

                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 block mb-1">
                                            Pincodes <span className="text-gray-400 text-xs">(comma separated)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pincodes"
                                            value={formData.pincodes}
                                            onChange={handleChange}
                                            placeholder="600001, 600002, 600003"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isServiceable"
                                            id="isServiceable"
                                            checked={formData.isServiceable}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-orange-500"
                                        />
                                        <label htmlFor="isServiceable" className="text-sm font-medium text-gray-700">
                                            Serviceable
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                        <FiSave /> {editingId ? 'Update Location' : 'Add Location'}
                                    </button>
                                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }} className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Locations Grid */}
                    {locations.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiMapPin className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No locations added yet</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {locations.map(loc => (
                                <div key={loc._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                                                <FiMapPin />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{loc.city}</p>
                                                <p className="text-sm text-gray-500">{loc.state}, {loc.country}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(loc)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                <FiEdit2 />
                                            </button>
                                            <button onClick={() => handleDelete(loc._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Delivery Charges</span>
                                            <span className="font-medium">₹{loc.deliveryCharges}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Est. Delivery</span>
                                            <span className="font-medium">{loc.estimatedDeliveryDays} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Pincodes</span>
                                            <span className="font-medium text-xs">{loc.pincodes?.slice(0, 3).join(', ')}{loc.pincodes?.length > 3 ? '...' : ''}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${loc.isServiceable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {loc.isServiceable ? 'Serviceable' : 'Not Serviceable'}
                                            </span>
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

export default AdminLocations;