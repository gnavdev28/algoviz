const Home = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-12 w-full">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Trực quan hóa<br/>Thuật toán.
          </h1>
          
          <p className="text-xl uppercase tracking-widest border-y-4 border-black dark:border-gray-600 py-6 font-bold text-slate-700 dark:text-slate-300">
            Sprint 3 – Battle Mode & CI/CD
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <button 
              onClick={() => onNavigate('workspace')}
              className="uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-12 py-5 font-black text-lg border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] dark:hover:shadow-[12px_12px_0_0_rgba(255,255,255,0.4)] transition-all w-full sm:w-auto"
            >
              BẮT ĐẦU HỌC
            </button>
            <button 
              onClick={() => onNavigate('battle')}
              className="uppercase tracking-widest bg-white dark:bg-gray-900 text-black dark:text-white px-12 py-5 font-black text-lg border-4 border-black dark:border-gray-500 shadow-[8px_8px_0_0_#ccc] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#ccc] transition-all w-full sm:w-auto"
            >
              BATTLE MODE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
