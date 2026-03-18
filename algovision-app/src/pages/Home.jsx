const Home = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-12 w-full">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Trực quan hóa<br/>Thuật toán.
          </h1>
          
          <p className="text-xl uppercase tracking-widest border-y-4 border-black py-6 font-bold">
            PBM. Phân rã tính năng - Tập trung Sprint 1
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <button 
              onClick={() => onNavigate('workspace')}
              className="uppercase tracking-widest bg-black text-white px-12 py-5 font-black text-lg border-4 border-black shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all w-full sm:w-auto"
            >
              BẮT ĐẦU HỌC NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
