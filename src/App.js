import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import SimpleBoard from './components/SimpleBoard';
import RiotSearchPage from './pages/RiotSearchPage';
import MatchDetailPage from './pages/MatchDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import { MessageSquare, Trophy, LogIn } from 'lucide-react';

// 네비게이션 컴포넌트 (현재 경로 감지용)
function Navigation() {
  const location = useLocation();
  const isBoard = location.pathname === '/board';
  const isRiot = location.pathname.startsWith('/riot');

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/riot" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-xl font-bold text-gray-900">ToyProject</div>
            <div className="text-sm text-gray-500">| 토이 프로젝트</div>
          </Link>
          
          <div className="flex space-x-1">
            <Link
              to="/board"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isBoard 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={18} />
              게시판
            </Link>
            
            <Link
              to="/riot"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isRiot 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Trophy size={18} />
              게임 전적
            </Link>
            
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
            >
              <LogIn size={18} />
              로그인
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<RiotSearchPage />} />
              <Route path="/board" element={<SimpleBoard />} />
              <Route path="/riot" element={<RiotSearchPage />} />
              <Route path="/riot/match/:matchId" element={<MatchDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
