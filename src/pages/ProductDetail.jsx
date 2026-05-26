import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleProduct, createReview, clearMessage, clearError } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import MetaData from '../components/common/MetaData';
import Loader from '../components/common/Loader';
import { FiStar, FiShoppingCart, FiShield, FiTruck, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { product, loading, error, message } = useSelector(state => state.product);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedTenure, setSelectedTenure] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (product?.rentalTenure) setSelectedTenure(product.rentalTenure[0]);
    }, [product]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); }
    }, [error, message, dispatch]);

    const handleAddToCart = () => {
        if (!isAuthenticated) return toast.error("Please login to add items to cart");
        if (!selectedTenure) return toast.error("Please select a rental tenure");
        dispatch(addToCart({ productId: id, quantity, rentalTenure: selectedTenure }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error("Please login to submit a review");
        dispatch(createReview({ productId: id, rating: reviewRating, comment: reviewComment }));
        setShowReviewForm(false);
        setReviewComment('');
    };

    if (loading) return <Loader />;
    if (!product) return null;

    const totalMonthlyPrice = product.price * quantity;
    const totalForTenure = totalMonthlyPrice * selectedTenure;

    return (
        <>
            <MetaData title={product.name} />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-7xl w-full">

                    {/* Product Main */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">

                        {/* Images */}
                        <div>
                            <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4 h-80 flex items-center justify-center">
                                <img
                                    src={product.images?.[selectedImage]?.url || '/placeholder.png'}
                                    alt={product.name}
                                    className="object-contain h-full w-full"
                                />
                            </div>
                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${selectedImage === i ? 'border-orange-500' : 'border-gray-200'}`}
                                        >
                                            <img src={img.url} alt={`img-${i}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <span className="text-sm text-orange-500 font-medium">{product.category}</span>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 mb-3">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FiStar
                                            key={star}
                                            className={`text-lg ${star <= product.ratings ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">({product.numberOfReviews} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="bg-orange-50 rounded-xl p-4 mb-6">
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-3xl font-bold text-gray-800">₹{product.price}</span>
                                    <span className="text-gray-400">/month</span>
                                </div>
                                <p className="text-sm text-gray-500">Security Deposit: <span className="font-semibold text-gray-700">₹{product.securityDeposit}</span></p>
                                {selectedTenure && (
                                    <p className="text-sm text-orange-600 font-medium mt-1">
                                        Total for {selectedTenure} months: ₹{totalForTenure}
                                    </p>
                                )}
                            </div>

                            {/* Tenure Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Select Rental Tenure</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {product.rentalTenure?.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTenure(t)}
                                            className={`px-5 py-2.5 rounded-xl border-2 font-medium transition ${selectedTenure === t ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                                        >
                                            {t} Months
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Quantity</h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-semibold text-gray-800">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-400">({product.stock} available)</span>
                                </div>
                            </div>

                            {/* Availability Badge */}
                            <div className="mb-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.availability}
                                </span>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.availability !== 'Available'}
                                className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
                            >
                                <FiShoppingCart className="text-xl" />
                                {product.availability === 'Available' ? 'Add to Cart' : 'Not Available'}
                            </button>
                        </div>
                    </div>

                    {/* Description & Features */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Included</h2>
                            <ul className="space-y-3">
                                {[
                                    { icon: <FiTruck />, text: "Free Delivery & Setup" },
                                    { icon: <FiTool />, text: "Free Maintenance" },
                                    { icon: <FiShield />, text: "Damage Protection" },
                                ].map(item => (
                                    <li key={item.text} className="flex items-center gap-3 text-gray-600">
                                        <span className="text-orange-500">{item.icon}</span>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                Reviews ({product.numberOfReviews})
                            </h2>
                            {isAuthenticated && (
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>

                        {/* Review Form */}
                        {showReviewForm && (
                            <form onSubmit={handleReviewSubmit} className="bg-orange-50 rounded-xl p-5 mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Your Review</h3>
                                <div className="flex gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                        >
                                            <FiStar className={`text-2xl transition ${star <= reviewRating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    rows={3}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none text-sm"
                                />
                                <div className="flex gap-3 mt-3">
                                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors">
                                        Submit
                                    </button>
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl font-medium text-sm hover:border-gray-300 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Reviews List */}
                        {product.reviews?.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
                        ) : (
                            <div className="space-y-4">
                                {product.reviews?.map((review, i) => (
                                    <div key={i} className="border-b border-gray-50 pb-4 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {review.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{review.name}</p>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FiStar key={star} className={`text-xs ${star <= review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;