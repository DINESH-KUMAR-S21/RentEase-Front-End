import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const perks = [
  'Free delivery & setup',
  'Zero damage hassle',
  '24/7 service support',
];

const floatingCards = [
  { emoji: '🛋️', label: 'Sofa', price: '₹399/mo', top: '12%', left: '8%' },
  { emoji: '❄️', label: 'AC', price: '₹799/mo', top: '60%', right: '6%' },
  { emoji: '📺', label: 'TV', price: '₹499/mo', bottom: '10%', left: '12%' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 min-h-[520px] flex items-center">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <div className="text-white text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India's #1 Furniture Rental Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-5">
              Furnish Your Home
              <span className="block text-orange-200 mt-1">Without Buying</span>
            </h1>

            {/* Subtext */}
            <p className="text-orange-100 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Rent premium furniture & appliances on a monthly basis. Delivery, setup & maintenance all included — no hidden charges.
            </p>

            {/* Perks */}
            <ul className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start flex-wrap">
              {perks.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-orange-100">
                  <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <FiCheck className="text-white text-xs" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-500 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-black/10 text-sm"
              >
                Browse Products <FiArrowRight />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all backdrop-blur-sm text-sm"
              >
                Get Started Free
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '500+', label: 'Products' },
                { value: '20+', label: 'Cities' },
              ].map(stat => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-orange-200 text-xs font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Main card */}
            <div className="relative w-80 h-80">
              {/* Central illustration */}
              <div className="w-full h-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                <div className="text-8xl mb-3 drop-shadow-lg select-none">🛋️</div>
                <p className="text-white font-bold text-lg">Premium Rentals</p>
                <p className="text-orange-200 text-sm mt-1">Starting ₹299/month</p>

                {/* Rating pill */}
                <div className="mt-4 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-yellow-300 text-sm">★★★★★</span>
                  <span className="text-white text-xs font-medium">4.8 / 5</span>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🛏️</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">King Bed</p>
                  <p className="text-xs text-orange-500 font-semibold">₹599/mo</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">❄️</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">AC 1.5 Ton</p>
                  <p className="text-xs text-orange-500 font-semibold">₹799/mo</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">📺</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">55" Smart TV</p>
                  <p className="text-xs text-orange-500 font-semibold">₹899/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;