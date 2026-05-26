import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCart, removeCartItem, updateCartItem, clearCart, clearError, clearMessage } from '../redux/slices/cartSlice';
import MetaData from '../components/common/MetaData';
import Loader from '../components/common/Loader';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, loading, error, message } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(getMyCart());
    }, [dispatch]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); }
    }, [error, message, dispatch]);

    const handleRemove = (productId) => {
        dispatch(removeCartItem(productId));
    };

    const handleTenureChange = (productId, rentalTenure) => {
        dispatch(updateCartItem({ productId, rentalTenure: Number(rentalTenure) }));
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 1) return;
        dispatch(updateCartItem({ productId, quantity: Number(quantity) }));
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="My Cart" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-6xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">My Cart</h1>

                    {!cart || cart.cartItems?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                            <p className="text-gray-400 mb-6">Add some products to get started</p>
                            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Cart Items */}
                            <div className="flex-1 space-y-4">
                                {cart.cartItems.map(item => (
                                    <div key={item.product} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-5">
                                        {/* Image */}
                                        <img
                                            src={item.image || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full sm:w-28 h-28 object-cover rounded-xl bg-gray-50"
                                        />

                                        {/* Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-orange-500 transition-colors">
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(item.product)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>

                                            <p className="text-orange-500 font-semibold mb-3">₹{item.price}/month</p>

                                            <div className="flex flex-wrap gap-4">
                                                {/* Tenure */}
                                                <div>
                                                    <label className="text-xs text-gray-500 block mb-1">Rental Tenure</label>
                                                    <select
                                                        value={item.rentalTenure}
                                                        onChange={e => handleTenureChange(item.product, e.target.value)}
                                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                                                    >
                                                        {[3, 6, 12].map(t => (
                                                            <option key={t} value={t}>{t} Months</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity */}
                                                <div>
                                                    <label className="text-xs text-gray-500 block mb-1">Quantity</label>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleQuantityChange(item.product, item.quantity - 1)} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500">-</button>
                                                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item.product, item.quantity + 1)} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500">+</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 mt-2">
                                                Subtotal: <span className="font-semibold text-gray-800">₹{item.price * item.quantity * item.rentalTenure}</span>
                                                <span className="text-xs ml-1">for {item.rentalTenure} months</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Clear Cart */}
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
                                >
                                    <FiTrash2 /> Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="w-full lg:w-80 shrink-0">
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                                    <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Rental Total</span>
                                            <span className="font-medium">₹{cart.totalPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Security Deposit</span>
                                            <span className="font-medium">₹{cart.totalSecurityDeposit}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Delivery</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <hr className="border-gray-100" />
                                        <div className="flex justify-between font-bold text-gray-800">
                                            <span>Total Payable</span>
                                            <span>₹{cart.totalPrice + cart.totalSecurityDeposit}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            * Security deposit is fully refundable
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Proceed to Checkout <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default Cart;