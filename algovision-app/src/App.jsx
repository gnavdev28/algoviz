import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import Battle from './pages/Battle';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedModule, setSelectedModule] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const handleNavigate = (page, module = null) => {
    setCurrentPage(page);
    setSelectedModule(module);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} isDark={isDark} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {currentPage === 'home' ? <Home onNavigate={handleNavigate} /> : 
         currentPage === 'battle' ? <Battle /> : <Workspace initialModule={selectedModule} />}
      </main>
    </div>
  );
}

export default App;
