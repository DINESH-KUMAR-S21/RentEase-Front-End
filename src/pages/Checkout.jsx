import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearError, clearMessage } from '../redux/slices/orderSlice';
import { createRental } from '../redux/slices/rentalSlice';
import MetaData from '../components/common/MetaData';
import Loader from '../components/common/Loader';
import { FiMapPin, FiPhone, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector(state => state.cart);
    const { loading, error, message, order } = useSelector(state => state.order);
    const { user } = useSelector(state => state.auth);

    const [step, setStep] = useState(1); // 1: Shipping, 2: Rental Info, 3: Review

    const [shippingInfo, setShippingInfo] = useState({
        address: '', city: '', state: '', country: 'India',
        pincode: '', phoneNo: ''
    });

    const [rentalInfo, setRentalInfo] = useState({
        rentalTenure: cart?.cartItems?.[0]?.rentalTenure || 3,
        rentalStartDate: '',
        deliveryDate: ''
    });

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) {
            toast.success(message);
            dispatch(clearMessage());
        }
    }, [error, message, dispatch]);

    useEffect(() => {
        if (order?._id) {
            dispatch(createRental(order._id));
            navigate('/orders/me');
        }
    }, [order, dispatch, navigate]);

    const handleShippingChange = e => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleRentalChange = e => {
        setRentalInfo({ ...rentalInfo, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {
        if (!cart || cart.cartItems.length === 0) {
            return toast.error("Your cart is empty");
        }

        const orderData = {
            shippingInfo: { ...shippingInfo, pincode: Number(shippingInfo.pincode), phoneNo: Number(shippingInfo.phoneNo) },
            orderItems: cart.cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                product: item.product
            })),
            paymentInfo: { id: `PAY_${Date.now()}`, status: "succeeded" },
            itemsPrice: cart.totalPrice,
            shippingPrice: 0,
            taxPrice: Math.round(cart.totalPrice * 0.18),
            totalPrice: cart.totalPrice + Math.round(cart.totalPrice * 0.18),
            rentalTenure: Number(rentalInfo.rentalTenure),
            rentalStartDate: rentalInfo.rentalStartDate,
            deliveryDate: rentalInfo.deliveryDate,
            securityDeposit: cart.totalSecurityDeposit
        };

        dispatch(createOrder(orderData));
    };

    if (loading) return <Loader />;
    if (!cart || cart.cartItems?.length === 0) {
        navigate('/cart');
        return null;
    }

    const tax = Math.round(cart.totalPrice * 0.18);
    const grandTotal = cart.totalPrice + tax + cart.totalSecurityDeposit;

    return (
        <>
            <MetaData title="Checkout" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-5xl w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

                    {/* Steps Indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        {['Shipping', 'Rental Info', 'Review'].map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {step > i + 1 ? <FiCheckCircle /> : i + 1}
                                </div>
                                <span className={`text-sm font-medium ${step === i + 1 ? 'text-orange-500' : 'text-gray-400'}`}>{s}</span>
                                {i < 2 && <div className={`w-12 h-0.5 ${step > i + 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Form */}
                        <div className="flex-1">

                            {/* Step 1 - Shipping */}
                            {step === 1 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                                        <FiMapPin className="text-orange-500" /> Shipping Information
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Full Address', name: 'address', placeholder: 'Street address', full: true },
                                            { label: 'City', name: 'city', placeholder: 'City' },
                                            { label: 'State', name: 'state', placeholder: 'State' },
                                            { label: 'Pincode', name: 'pincode', placeholder: '600001', type: 'number' },
                                            { label: 'Phone Number', name: 'phoneNo', placeholder: '9876543210', type: 'number' },
                                        ].map(field => (
                                            <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                                                <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
                                                <input
                                                    type={field.type || 'text'}
                                                    name={field.name}
                                                    value={shippingInfo[field.name]}
                                                    onChange={handleShippingChange}
                                                    placeholder={field.placeholder}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            const { address, city, state, pincode, phoneNo } = shippingInfo;
                                            if (!address || !city || !state || !pincode || !phoneNo) return toast.error("Please fill all fields");
                                            setStep(2);
                                        }}
                                        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        Continue to Rental Info
                                    </button>
                                </div>
                            )}

                            {/* Step 2 - Rental Info */}
                            {step === 2 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                                        <FiCalendar className="text-orange-500" /> Rental Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1">Rental Tenure</label>
                                            <select
                                                name="rentalTenure"
                                                value={rentalInfo.rentalTenure}
                                                onChange={handleRentalChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                            >
                                                <option value={3}>3 Months</option>
                                                <option value={6}>6 Months</option>
                                                <option value={12}>12 Months</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1">Rental Start Date</label>
                                            <input
                                                type="date"
                                                name="rentalStartDate"
                                                value={rentalInfo.rentalStartDate}
                                                onChange={handleRentalChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1">Preferred Delivery Date</label>
                                            <input
                                                type="date"
                                                name="deliveryDate"
                                                value={rentalInfo.deliveryDate}
                                                onChange={handleRentalChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors">
                                            Back
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!rentalInfo.rentalStartDate || !rentalInfo.deliveryDate) return toast.error("Please fill all fields");
                                                setStep(3);
                                            }}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 - Review */}
                            {step === 3 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="font-bold text-gray-800 text-lg mb-5">Review Your Order</h2>

                                    {/* Items */}
                                    <div className="space-y-3 mb-5">
                                        {cart.cartItems.map(item => (
                                            <div key={item.product} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity} × {item.rentalTenure} months</p>
                                                </div>
                                                <p className="font-semibold text-gray-800">₹{item.price * item.quantity * item.rentalTenure}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Summary */}
                                    <div className="bg-orange-50 rounded-xl p-4 mb-5 text-sm">
                                        <p className="font-medium text-gray-700 mb-1">📦 Delivery to:</p>
                                        <p className="text-gray-600">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                                        <p className="text-gray-600 mt-1">📅 Delivery Date: {rentalInfo.deliveryDate}</p>
                                        <p className="text-gray-600">📅 Rental: {rentalInfo.rentalStartDate} for {rentalInfo.rentalTenure} months</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors">
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                                        >
                                            {loading ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                                <h2 className="font-bold text-gray-800 mb-4">Price Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Rental Amount</span>
                                        <span>₹{cart.totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">GST (18%)</span>
                                        <span>₹{tax}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Security Deposit</span>
                                        <span>₹{cart.totalSecurityDeposit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between font-bold text-gray-800 text-base">
                                        <span>Grand Total</span>
                                        <span>₹{grandTotal}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">* Deposit refundable at end of rental</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;