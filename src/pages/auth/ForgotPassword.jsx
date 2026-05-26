import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearMessage } from '../../redux/slices/authSlice';
import { FiMail, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from '../../components/common/MetaData';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector(state => state.auth);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); }
    }, [error, message, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <>
            <MetaData title="Forgot Password" />
            <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                                <FiHome className="text-white text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
                            <p className="text-gray-500 text-sm mt-1 text-center">
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Remember your password?{' '}
                            <Link to="/login" className="text-orange-500 font-medium hover:text-orange-600">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;