const StatCard = ({ title, value, icon, color = "orange", subtitle }) => {
    const colorMap = {
        orange: "bg-orange-50 text-orange-500 border-orange-100",
        green: "bg-green-50 text-green-500 border-green-100",
        blue: "bg-blue-50 text-blue-500 border-blue-100",
        red: "bg-red-50 text-red-500 border-red-100",
        purple: "bg-purple-50 text-purple-500 border-purple-100"
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;