import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} isDark={isDark} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {currentPage === 'home' ? <Home onNavigate={setCurrentPage} /> : <Workspace />}
      </main>
    </div>
  );
}

export default App;
