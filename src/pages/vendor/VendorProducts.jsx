import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../components/common/MetaData';
import Loader from '../../components/common/Loader';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const categories = [
    "Bed", "Sofa", "Table", "Chair", "Wardrobe", "Bookshelf",
    "Refrigerator", "Washing Machine", "TV", "Air Conditioner",
    "Microwave", "Water Purifier", "Other"
];

const emptyForm = {
    name: '', description: '', price: '', securityDeposit: '',
    rentalTenure: [3, 6, 12], stock: 1, category: '', availability: 'Available'
};

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/vendor/products');
            setProducts(data.products);
        } catch (err) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTenureToggle = (t) => {
        const tenures = formData.rentalTenure.includes(t)
            ? formData.rentalTenure.filter(x => x !== t)
            : [...formData.rentalTenure, t].sort((a, b) => a - b);
        setFormData({ ...formData, rentalTenure: tenures });
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            securityDeposit: product.securityDeposit,
            rentalTenure: product.rentalTenure,
            stock: product.stock,
            category: product.category,
            availability: product.availability
        });

        // Set existing images for preview (if editing)
        if (product.images && product.images.length > 0) {
            setImagePreviews(product.images.map(img => img.url));
            // Note: We don't set selectedImages for existing images since they're already uploaded
        }

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`/vendor/product/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete product");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const submitData = new FormData();

            // Add text fields
            Object.keys(formData).forEach(key => {
                if (key === 'rentalTenure') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Add images
            selectedImages.forEach(image => {
                submitData.append('images', image);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingId) {
                await axios.put(`/vendor/product/${editingId}`, submitData, config);
                toast.success("Product updated successfully");
            } else {
                await axios.post('/vendor/product/create', submitData, config);
                toast.success("Product created successfully");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);
            setSelectedImages([]);
            setImagePreviews([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
        setSelectedImages([]);
        setImagePreviews([]);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setSelectedImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    if (loading) return <Loader />;

    return (
        <>
            <MetaData title="Vendor Products" />
            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="max-w-6xl w-full">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingId(null);
                                setFormData(emptyForm);
                                setSelectedImages([]);
                                setImagePreviews([]);
                            }}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                            {showForm ? <FiX /> : <FiPlus />}
                            {showForm ? 'Close' : 'Add Product'}
                        </button>
                    </div>

                    {/* Product Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                            <h2 className="font-bold text-gray-800 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Product Name</label>
                                        <input
                                            name="name" value={formData.name} onChange={handleChange}
                                            placeholder="e.g. King Size Bed"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                                        <textarea
                                            name="description" value={formData.description} onChange={handleChange}
                                            placeholder="Describe the product..."
                                            rows={3} required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm resize-none"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                                        <select
                                            name="category" value={formData.category} onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        >
                                            <option value="">Select category...</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Availability</label>
                                        <select
                                            name="availability" value={formData.availability} onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        >
                                            {["Available", "Rented", "Under Maintenance", "Unavailable"].map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Monthly Price (₹)</label>
                                        <input
                                            type="number" name="price" value={formData.price} onChange={handleChange}
                                            placeholder="e.g. 999" required min="1"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    </div>

                                    {/* Security Deposit */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Security Deposit (₹)</label>
                                        <input
                                            type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange}
                                            placeholder="e.g. 2000" required min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Stock</label>
                                        <input
                                            type="number" name="stock" value={formData.stock} onChange={handleChange}
                                            placeholder="1" required min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    </div>

                                    {/* Rental Tenure */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Rental Tenure Options</label>
                                        <div className="flex gap-3">
                                            {[3, 6, 12].map(t => (
                                                <button
                                                    key={t} type="button"
                                                    onClick={() => handleTenureToggle(t)}
                                                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${formData.rentalTenure.includes(t) ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                                                >
                                                    {t}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Product Images (Max 5)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <FiPlus className="text-3xl text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">Click to upload images</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Selected Images:</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        <FiSave />
                                        {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button
                                        type="button" onClick={handleCancel}
                                        disabled={uploading}
                                        className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products Table */}
                    {products.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                            <FiPackage className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
                            <p className="text-gray-400">Add your first product to get started</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map(product => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.images?.[0]?.url || '/placeholder.png'}
                                                            alt={product.name}
                                                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                        />
                                                        <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">₹{product.price}/mo</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.availability === 'Available' ? 'bg-green-100 text-green-700' : product.availability === 'Rented' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {product.availability}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
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

export default VendorProducts;