import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <FiHome className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Rent<span className="text-orange-500">Ease</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            India's trusted platform for renting furniture and home appliances. Furnish your home without the burden of ownership.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><FaFacebook /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><FaTwitter /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><FaInstagram /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><FaLinkedin /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-orange-500 transition-colors">Browse Products</Link></li>
                            <li><Link to="/locations" className="hover:text-orange-500 transition-colors">Serviceable Locations</Link></li>
                            <li><Link to="/register" className="hover:text-orange-500 transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            {["Bed", "Sofa", "Refrigerator", "Washing Machine", "TV", "Air Conditioner"].map(cat => (
                                <li key={cat}>
                                    <Link
                                        to={`/products?category=${cat}`}
                                        className="hover:text-orange-500 transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <FiMapPin className="text-orange-500 shrink-0" />
                                <span>Chennai, Tamil Nadu, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-orange-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-orange-500 shrink-0" />
                                <span>support@rentease.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} RentEase. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Refund Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;