import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
        if (isAuthenticated) {
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            localStorage.removeItem('redirectAfterLogin');

            if (redirectPath) {
                navigate(redirectPath);
            } else if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [error, isAuthenticated, user, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Login" />

            <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl">

                    {/* Card */}
                    <div className="relative bg-white rounded-[28px] shadow-2xl p-8 min-h-[480px] flex flex-col justify-center">

                        {/* Overlapping logo badge */}
                        <div className="absolute z-10 left-1/2 top-0" style={{ transform: 'translate(-50%, -50%)' }}>
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-md ring-4 ring-white">
                                <FiHome className="text-white" style={{ fontSize: '1.5rem' }} />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="relative text-center mb-8">
                            <h1 className="text-2xl font-semibold text-gray-700 leading-tight">Login</h1>
                            <p className="text-gray-500 text-sm mt-2">Login to your Rentyfy account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>

                            {/* Email */}
                            <div className="relative" style={{marginBottom: 16, zIndex: 10}}>
                                <FiMail className="absolute left-4 top-1/2 text-gray-400" style={{ transform: 'translateY(-50%)' }} />
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="block w-full h-12 pl-12 pr-4 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                                    style={{height: 48, paddingLeft: 48}}
                                />
                            </div>

                            {/* Password */}
                            <div className="relative" style={{marginBottom: 1, zIndex: 10}}>
                                <FiLock className="absolute left-4 top-1/2 text-gray-400" style={{ transform: 'translateY(-50%)' }} />
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="block w-full h-12 pl-12 pr-12 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                                    style={{height: 48, paddingLeft: 40, paddingRight: 48}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 text-gray-400 hover:text-gray-600"
                                    style={{ transform: 'translateY(-50%)', zIndex: 20 }}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>

                            {/* Submit */}
                            <div style={{marginTop: 100, zIndex: 10}}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="block w-full h-12 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full font-semibold transition-colors disabled:opacity-60"
                                    style={{height: 48}}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>

                            {/* Forgot password */}
                            <p className="text-center">
                                <Link
                                    to="/password/forgot"
                                    className="text-sm text-orange-500 hover:text-orange-600"
                                >
                                    Forgot your password?
                                </Link>
                            </p>
                        </form>

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-orange-500 font-medium hover:text-orange-600">
                                Register here
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;