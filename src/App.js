import React, { useState } from 'react';
import SimpleBoard from './components/SimpleBoard';
import RiotGameData from './components/RiotGameData';
import { MessageSquare, Trophy } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('board');

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-gray-900">ToyProject</div>
              <div className="text-sm text-gray-500">| 토이 프로젝트</div>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage('board')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentPage === 'board' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={18} />
                게시판
              </button>
              
              <button
                onClick={() => setCurrentPage('riot')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentPage === 'riot' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Trophy size={18} />
                게임 전적
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="min-h-screen">
        {currentPage === 'board' && <SimpleBoard />}
        {currentPage === 'riot' && <RiotGameData />}
      </div>
    </div>
  );
}

export default App;
