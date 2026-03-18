const Navbar = ({ currentPage, onNavigate }) => {
  return (
    <nav className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0 z-50">
      <div 
        className="cursor-pointer font-black text-2xl tracking-tighter uppercase text-black" 
        onClick={() => onNavigate('home')}
      >
        ALGOVISION.
      </div>
      
      <div className="flex items-center gap-6 text-sm uppercase tracking-widest font-black text-black">
        <button 
          onClick={() => onNavigate('workspace')}
          className={`transition-all hover:opacity-50 ${currentPage === 'workspace' ? 'underline decoration-4 underline-offset-8' : ''}`}
        >
          KHÔNG GIAN HỌC
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
