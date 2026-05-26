import { FiX } from 'react-icons/fi';

const categories = [
    "Bed", "Sofa", "Table", "Chair", "Wardrobe", "Bookshelf",
    "Refrigerator", "Washing Machine", "TV", "Air Conditioner",
    "Microwave", "Water Purifier", "Other"
];

const ProductFilter = ({ filters, setFilters, onClose }) => {

    const handleCategory = (cat) => {
        setFilters(prev => ({ ...prev, category: prev.category === cat ? '' : cat, page: 1 }));
    };

    const handlePrice = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
    };

    const handleRating = (rating) => {
        setFilters(prev => ({ ...prev, ratings: prev.ratings === rating ? '' : rating, page: 1 }));
    };

    const handleReset = () => {
        setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', ratings: '', page: 1 });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                        Reset All
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
                            <FiX />
                        </button>
                    )}
                </div>
            </div>

            {/* Category */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category === cat}
                                onChange={() => handleCategory(cat)}
                                className="w-4 h-4 accent-orange-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-orange-500 transition-colors">
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Monthly Price (₹)</h4>
                <div className="flex gap-2">
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handlePrice}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handlePrice}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map(r => (
                        <label key={r} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.ratings === r}
                                onChange={() => handleRating(r)}
                                className="w-4 h-4 accent-orange-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-orange-500 transition-colors">
                                {r}★ & above
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;