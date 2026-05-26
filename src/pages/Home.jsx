import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/slices/productSlice';
import MetaData from '../components/common/MetaData';
import Hero from '../components/layout/Hero';
import Categories from '../components/layout/Categories';
import ProductCard from '../components/product/ProductCard';
import { FiArrowRight, FiShield, FiTruck, FiTool, FiRotateCcw } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const features = [
  {
    icon: <FiTruck className="text-2xl" />,
    title: 'Free Delivery & Setup',
    desc: 'White-glove delivery and professional setup at your doorstep, at zero extra cost.',
    color: 'bg-blue-50 text-blue-500 border-blue-100',
  },
  {
    icon: <FiTool className="text-2xl" />,
    title: 'Free Maintenance',
    desc: 'Our technicians handle all repairs and servicing throughout your rental period.',
    color: 'bg-green-50 text-green-500 border-green-100',
  },
  {
    icon: <FiShield className="text-2xl" />,
    title: 'Damage Protection',
    desc: "Accidental damage? We've got you covered. No surprise bills.",
    color: 'bg-orange-50 text-orange-500 border-orange-100',
  },
  {
    icon: <FiRotateCcw className="text-2xl" />,
    title: 'Easy Returns',
    desc: 'Return, upgrade, or swap your rented items anytime — zero complications.',
    color: 'bg-purple-50 text-purple-500 border-purple-100',
  },
];

const testimonials = [
  { name: 'Arun K.', city: 'Chennai', review: 'Moved to a new city and RentEase had my apartment fully furnished in 2 days. Incredible service!', rating: 5 },
  { name: 'Priya S.', city: 'Bangalore', review: 'Saved so much money renting instead of buying. The furniture quality is surprisingly premium.', rating: 5 },
  { name: 'Ravi M.', city: 'Hyderabad', review: 'The AC stopped working and a technician was at my place within 4 hours. Superb support!', rating: 5 },
];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(s => s.product);

  useEffect(() => {
    dispatch(getAllProducts('random=true&limit=4'));
  }, [dispatch]);

  return (
    <>
      <MetaData title="Home" />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Trust bar ── */}
      <div className="w-full bg-gray-900 py-4">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-gray-400">
            {[
              '🏆 10,000+ Happy Customers',
              '🚚 Free Delivery in 20+ Cities',
              '🔧 Same-day Maintenance',
              '💳 No Credit Card Required',
            ].map(item => (
              <span key={item} className="whitespace-nowrap">{item}</span>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <Categories />

      {/* ── Featured Products ── */}
      <section className="py-16 w-full bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">Handpicked for you</p>
              <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2 text-sm">Top picks to furnish your home</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors shrink-0"
            >
              View all <FiArrowRight />
            </Link>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 h-80 animate-pulse">
                  <div className="bg-gray-100 h-52 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 w-full bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">Simple as 1-2-3</p>
            <h2 className="text-3xl font-black text-gray-900">How RentEase Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />

            {[
              { step: '01', emoji: '🔍', title: 'Browse & Choose', desc: 'Explore hundreds of premium furniture and appliance options, filter by category, price, or tenure.' },
              { step: '02', emoji: '🗓️', title: 'Select & Schedule', desc: 'Pick your rental tenure (3, 6 or 12 months), choose a delivery date, and checkout in minutes.' },
              { step: '03', emoji: '🏠', title: 'Relax at Home', desc: 'We deliver, set up everything, and handle all maintenance for the duration of your rental.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-orange-50 border-4 border-white shadow-lg rounded-3xl flex items-center justify-center text-3xl mb-4 relative z-10">
                  {item.emoji}
                </div>
                <span className="text-xs font-black text-orange-300 tracking-widest mb-2">STEP {item.step}</span>
                <h3 className="font-black text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>        </div>      </section>

      {/* ── Why RentEase ── */}
      <section className="py-16 w-full bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">Our Promise</p>
            <h2 className="text-3xl font-black text-gray-900">Why Choose RentEase?</h2>
            <p className="text-gray-500 mt-2">We make renting simple, affordable, and completely hassle-free</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-orange-100 transition-all group">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 w-full bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-2">Customer Love</p>
            <h2 className="text-3xl font-black text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex text-orange-400 mb-3">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      {t.name} <MdVerified className="text-orange-400 text-xs" />
                    </p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 w-full bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full" />
        </div>
        <div className="w-full px-4 flex justify-center">
        <div className="relative max-w-3xl w-full text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Limited Time Offer — Free Setup on First Order
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Ready to Furnish<br />
            <span className="text-orange-400">Your Dream Home?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Start renting today. Plans from just ₹299/month. No long-term commitments, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-orange-500/30"
            >
              Start Renting Now <FiArrowRight />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default Home;