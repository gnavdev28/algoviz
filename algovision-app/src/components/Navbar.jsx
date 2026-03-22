import { Sun, Moon } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate, isDark, toggleTheme }) => {
  return (
    <nav className="h-16 border-b-4 border-[var(--border-main)] bg-[var(--bg-primary)] flex items-center justify-between px-6 shrink-0 z-50">
      <div 
        className="cursor-pointer font-black text-2xl tracking-tighter uppercase text-black dark:text-white" 
        onClick={() => onNavigate('home')}
      >
        ALGOVISION.
      </div>
      
      <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-black text-black dark:text-white">
        <button 
          onClick={() => onNavigate('workspace')}
          className={`transition-all duration-300 ${currentPage === 'workspace' ? 'opacity-100' : 'opacity-30 hover:opacity-100 font-medium'}`}
        >
          KHÔNG GIAN HỌC
        </button>
        <div className="w-[1px] h-4 bg-[var(--border-main)] opacity-10 hidden sm:block"></div>
        <button 
          onClick={() => onNavigate('battle')}
          className={`transition-all duration-300 ${currentPage === 'battle' ? 'opacity-100' : 'opacity-30 hover:opacity-100 font-medium'}`}
        >
          BATTLE MODE
        </button>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center neu-border-sm bg-[var(--bg-secondary)] hover:shadow-[3px_3px_0_0_var(--border-main)] hover:-translate-y-0.5 transition-all rounded-sm"
          title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
