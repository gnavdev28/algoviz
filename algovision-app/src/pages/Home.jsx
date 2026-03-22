import { BarChart2, Search, Layers, Lock } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const modules = [
    { 
      id: 'sort', 
      title: 'SẮP XẾP', 
      icon: <BarChart2 size={32} />, 
      color: 'bg-indigo-500',
      textColor: 'text-white',
      action: () => onNavigate('workspace', 'sort')
    },
    { 
      id: 'search', 
      title: 'TÌM KIẾM', 
      icon: <Search size={32} />, 
      color: 'bg-emerald-500',
      textColor: 'text-white',
      action: () => onNavigate('workspace', 'search')
    },
    { 
      id: 'list', 
      title: 'DS LIÊN KẾT', 
      icon: <Layers size={32} />, 
      color: 'bg-amber-500',
      textColor: 'text-white',
      action: () => onNavigate('workspace', 'list')
    },
    { 
      id: 'soon', 
      title: 'SẮP RA MẮT', 
      icon: <Lock size={32} />, 
      color: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-400 dark:text-slate-500',
      disabled: true
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] text-black dark:text-white pb-20 tracking-tight">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center space-y-8 mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Trực quan hóa<br/>Thuật toán.
          </h1>
          <p className="inline-block text-sm uppercase tracking-[0.3em] font-black border-2 border-[var(--border-main)] px-4 py-2 opacity-80">
            Học tập qua trải nghiệm thực tế
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={m.action}
              disabled={m.disabled}
              className={`group relative flex flex-col items-center justify-center p-12 border-4 border-[var(--border-main)] text-center transition-all ${
                m.disabled 
                ? 'cursor-not-allowed bg-[var(--bg-secondary)] opacity-50' 
                : `${m.color} hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--border-main)]`
              } shadow-[8px_8px_0_0_var(--border-main)]`}
            >
              <div className="mb-6 p-4 bg-white border-2 border-black inline-block w-fit group-hover:rotate-12 transition-transform text-black">
                {m.icon}
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-tighter drop-shadow-sm ${m.textColor}`}>
                {m.title}
              </h3>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
            <button 
              onClick={() => onNavigate('battle')}
              className="group inline-flex items-center gap-4 bg-[var(--bg-primary)] text-black dark:text-white px-12 py-6 font-black text-xl border-4 border-[var(--border-main)] shadow-[8px_8px_0_0_var(--border-main)] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--border-main)] transition-all uppercase"
            >
              SO SÁNH THUẬT TOÁN (BATTLE MODE)
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
