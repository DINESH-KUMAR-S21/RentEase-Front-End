import { useEffect, useState } from 'react';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiSearch, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const roleColors = {
    user: 'bg-blue-100 text-blue-700',
    vendor: 'bg-orange-100 text-orange-700',
    admin: 'bg-purple-100 text-purple-700'
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newRole, setNewRole] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, vendorsRes] = await Promise.all([
                axios.get('/admin/users'),
                axios.get('/admin/vendors')
            ]);
            setUsers(usersRes.data.users);
            setVendors(vendorsRes.data.vendors);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdateRole = async (id) => {
        try {
            await axios.put(`/admin/user/${id}`, { role: newRole });
            toast.success("User role updated");
            setEditingId(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            await axios.delete(`/admin/user/${id}`);
            toast.success("User deleted");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
    };

    const currentList = (activeTab === 'users' ? users : vendors)
        .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) ||
                     u.email.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Admin Users" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-6xl w-full">

                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm w-64"
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { key: 'users', label: `Customers (${users.length})` },
                            { key: 'vendors', label: `Vendors (${vendors.length})` }
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
                            <FiUsers className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No users found</h3>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {currentList.map(user => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {user.name[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    {editingId === user._id ? (
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={newRole}
                                                                onChange={e => setNewRole(e.target.value)}
                                                                className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-500"
                                                            >
                                                                {['user', 'vendor', 'admin'].map(r => (
                                                                    <option key={r} value={r}>{r}</option>
                                                                ))}
                                                            </select>
                                                            <button onClick={() => handleUpdateRole(user._id)} className="text-green-500 hover:text-green-700 text-xs font-medium">Save</button>
                                                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { setEditingId(user._id); setNewRole(user.role); }}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
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

export default AdminUsers;