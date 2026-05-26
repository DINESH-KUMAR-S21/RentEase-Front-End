import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { clearError, clearMessage } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { error, message } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
        if (message) { toast.success(message); dispatch(clearMessage()); }
    }, [error, message, dispatch]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error("Please login to add items to cart");
        dispatch(addToCart({
            productId: product._id,
            quantity: 1,
            rentalTenure: product.rentalTenure[0]
        }));
    };

    const availabilityColor = {
        "Available": "bg-green-100 text-green-700",
        "Rented": "bg-red-100 text-red-700",
        "Under Maintenance": "bg-yellow-100 text-yellow-700",
        "Unavailable": "bg-gray-100 text-gray-700"
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group overflow-hidden flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-50 h-52">
                <img
                    src={product.images?.[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium ${availabilityColor[product.availability]}`}>
                    {product.availability}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-orange-500 font-medium mb-1">{product.category}</span>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <FiStar className="text-orange-400 fill-orange-400 text-sm" />
                    <span className="text-sm text-gray-600">
                        {product.ratings?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-xs text-gray-400">({product.numberOfReviews || 0})</span>
                </div>

                {/* Price */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                        <span className="text-gray-400 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                        Security Deposit: ₹{product.securityDeposit}
                    </p>

                    {/* Tenure Badges */}
                    <div className="flex gap-1 mb-4 flex-wrap">
                        {product.rentalTenure?.map(t => (
                            <span key={t} className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full border border-orange-100">
                                {t}m
                            </span>
                        ))}
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.availability !== 'Available'}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl font-medium transition-colors text-sm"
                    >
                        <FiShoppingCart />
                        {product.availability === 'Available' ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;