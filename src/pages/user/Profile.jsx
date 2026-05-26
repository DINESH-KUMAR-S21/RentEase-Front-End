import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword, clearError, clearMessage } from '../../redux/slices/authSlice';
import MetaData from '../../components/common/MetaData';
import { FiUser, FiMail, FiLock, FiEdit2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading, error, message } = useSelector(state => state.auth);

    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); setEditMode(false); }
    }, [error, message, dispatch]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        dispatch(updateProfile(profileData));
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        dispatch(updatePassword(passwordData));
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <>
            <MetaData title="My Profile" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-3xl w-full">

                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                            <p className="text-orange-100">{user?.email}</p>
                            <span className="inline-block mt-2 bg-white/20 text-white text-xs px-3 py-1 rounded-full capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {['profile', 'password'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors capitalize ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-orange-200'}`}
                            >
                                {tab === 'profile' ? 'Edit Profile' : 'Change Password'}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-gray-800 text-lg">Personal Information</h2>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
                                >
                                    <FiEdit2 /> {editMode ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                            disabled={!editMode}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                            disabled={!editMode}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition text-sm"
                                        />
                                    </div>
                                </div>
                                {editMode && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                                    >
                                        <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-800 text-lg mb-6">Change Password</h2>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                {[
                                    { label: 'Current Password', key: 'oldPassword' },
                                    { label: 'New Password', key: 'newPassword' },
                                    { label: 'Confirm New Password', key: 'confirmPassword' }
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
                                        <div className="relative">
                                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                value={passwordData[field.key]}
                                                onChange={e => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default Profile;