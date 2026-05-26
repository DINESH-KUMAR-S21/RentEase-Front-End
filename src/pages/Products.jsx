import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import MetaData from '../components/common/MetaData';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Products = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { products, loading, totalProducts } = useSelector(state => state.product);

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        minPrice: '',
        maxPrice: '',
        ratings: '',
        page: 1
    });
    const [showFilter, setShowFilter] = useState(false);
    const resultPerPage = 8;

    useEffect(() => {
        const query = new URLSearchParams();
        if (filters.keyword) query.set('keyword', filters.keyword);
        if (filters.category) query.set('category', filters.category);
        if (filters.minPrice) query.set('price[gte]', filters.minPrice);
        if (filters.maxPrice) query.set('price[lte]', filters.maxPrice);
        if (filters.ratings) query.set('ratings[gte]', filters.ratings);
        query.set('page', filters.page);
        query.set('limit', resultPerPage);
        dispatch(getAllProducts(query.toString()));
    }, [dispatch, filters]);

    const totalPages = Math.ceil(totalProducts / resultPerPage);

    return (
        <>
            <MetaData title="Products" />
            <div className="min-h-screen w-full bg-gray-50">

                {/* Top Bar */}
                <div className="w-full bg-white border-b border-gray-100 sticky top-16 z-40">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
                    <div className="max-w-7xl w-full flex items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={filters.keyword}
                                onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value, page: 1 }))}
                                placeholder="Search furniture, appliances..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                            />
                            {filters.keyword && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, keyword: '', page: 1 }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilter(true)}
                            className="md:hidden flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium"
                        >
                            <FiFilter /> Filters
                        </button>
                    </div>
                    </div>
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
                <div className="max-w-7xl w-full flex gap-8">

                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <ProductFilter filters={filters} setFilters={setFilters} />
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {showFilter && (
                        <div className="fixed inset-0 z-50 flex md:hidden">
                            <div className="bg-black/50 flex-1" onClick={() => setShowFilter(false)} />
                            <div className="w-80 bg-white overflow-y-auto p-4">
                                <ProductFilter filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)} />
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Results Info */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-500 text-sm">
                                {loading ? 'Loading...' : `${totalProducts} products found`}
                                {filters.category && <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">{filters.category}</span>}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                        ) : products?.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search term</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-10">
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={filters.page === 1}
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                                                className={`w-10 h-10 rounded-lg font-medium transition ${filters.page === p ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={filters.page === totalPages}
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
                </div>
            </div>
        </>
    );
};

export default Products;