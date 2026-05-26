import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { MdChair, MdKitchen, MdTv } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';
import { GiWashingMachine } from 'react-icons/gi';
import { BiFridge } from 'react-icons/bi';

const categories = [
  { name: "Bed", icon: <FaBed />, color: "bg-orange-50 text-orange-500" },
  { name: "Sofa", icon: <MdChair />, color: "bg-blue-50 text-blue-500" },
  { name: "Refrigerator", icon: <BiFridge />, color: "bg-green-50 text-green-500" },
  { name: "TV", icon: <MdTv />, color: "bg-purple-50 text-purple-500" },
  { name: "Washing Machine", icon: <GiWashingMachine />, color: "bg-red-50 text-red-500" },
  { name: "Air Conditioner", icon: <MdChair />, color: "bg-yellow-50 text-yellow-500" },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you need for your home</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;