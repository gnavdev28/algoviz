import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workspace from './pages/Workspace';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {currentPage === 'home' ? <Home onNavigate={setCurrentPage} /> : <Workspace />}
      </main>
    </div>
  );
}

export default App;
