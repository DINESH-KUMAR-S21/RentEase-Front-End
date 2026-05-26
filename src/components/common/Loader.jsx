const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-orange-500 font-semibold text-lg tracking-wide">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;