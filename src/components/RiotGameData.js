import React, { useState } from 'react';
import { Search, User, Trophy, Clock, Coins, Zap, Shield, Sword, TrendingUp } from 'lucide-react';
import { riotAPI } from '../services/api';

const RiotGameData = () => {
  const [searchForm, setSearchForm] = useState({
    gameName: '',
    tagLine: ''
  });
  const [playerData, setPlayerData] = useState(null);
  const [matchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchForm.gameName || !searchForm.tagLine) {
      setError('게임 아이디와 태그를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 통합 API 호출 - 플레이어 정보 + 매치 히스토리 한 번에 받아오기
      const response = await riotAPI.getPlayerMatches(searchForm.gameName, searchForm.tagLine, 5);
      
      setPlayerData(response.data);
      setMatchData(response.data.matches || []);
    } catch (err) {
      setError(err.response?.data?.message || '데이터 조회 중 오류가 발생했습니다.');
      setPlayerData(null);
      setMatchData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // LocalDateTime 형식 처리 (2025-09-24T22:57:48 등)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getGameDuration = (durationSeconds) => {
    if (!durationSeconds || durationSeconds === 0) return 'N/A';
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankColor = (tier) => {
    const colors = {
      'IRON': 'text-gray-600',
      'BRONZE': 'text-amber-600',
      'SILVER': 'text-gray-400',
      'GOLD': 'text-yellow-500',
      'PLATINUM': 'text-cyan-500',
      'EMERALD': 'text-emerald-500',
      'DIAMOND': 'text-blue-500',
      'MASTER': 'text-purple-600',
      'GRANDMASTER': 'text-red-500',
      'CHALLENGER': 'text-yellow-400'
    };
    return colors[tier] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            라이엇 게임 전적 조회
          </h1>
          
          {/* Search Form */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="게임 아이디 (예: Faker)"
                value={searchForm.gameName}
                onChange={(e) => setSearchForm({...searchForm, gameName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="태그 (예: KR1)"
                value={searchForm.tagLine}
                onChange={(e) => setSearchForm({...searchForm, tagLine: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Search size={20} />
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>

          <p className="text-sm text-gray-600">
            💡 팁: 게임 아이디와 태그를 정확히 입력해주세요. (예: Faker + T1)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Player Info */}
        {playerData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-blue-500" />
              플레이어 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">게임 아이디</h3>
                <p className="text-lg text-blue-600">{playerData.player?.gameName}#{playerData.player?.tagLine}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">승률</h3>
                <p className="text-lg text-purple-600">{playerData.stats?.winRateString || '데이터 없음'}</p>
                <p className="text-xs text-gray-500">
                  {playerData.stats?.wins}승 {playerData.stats?.losses}패
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">평균 KDA</h3>
                <p className="text-lg text-green-600">{playerData.stats?.averageKDA?.toFixed(2) || '0.0'}</p>
                <p className="text-xs text-gray-500">
                  {playerData.stats?.getKDAString?.() || `${(playerData.stats?.totalKills/playerData.stats?.totalGames || 0).toFixed(1)}/${(playerData.stats?.totalDeaths/playerData.stats?.totalGames || 0).toFixed(1)}/${(playerData.stats?.totalAssists/playerData.stats?.totalGames || 0).toFixed(1)}`}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">주력 챔피언</h3>
                <p className="text-lg text-orange-600">{playerData.stats?.mostPlayedChampion || '데이터 없음'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">성과 평가</h3>
                <p className="text-lg font-semibold ${
                  (playerData.stats?.winRate || 0) >= 60 ? 'text-blue-600' : 
                  (playerData.stats?.winRate || 0) >= 50 ? 'text-green-600' : 
                  (playerData.stats?.winRate || 0) >= 40 ? 'text-yellow-600' : 'text-red-600'
                }">
                  {(playerData.stats?.winRate || 0) >= 70 ? '매우 좋음' : 
                   (playerData.stats?.winRate || 0) >= 60 ? '좋음' : 
                   (playerData.stats?.winRate || 0) >= 50 ? '보통' : 
                   (playerData.stats?.winRate || 0) >= 40 ? '아쉬움' : '분발 필요'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">분석 경기 수</h3>
                <p className="text-lg text-indigo-600">{playerData.stats?.totalGames || matchData.length}경기</p>
              </div>
            </div>
            
            {/* 매치 데이터가 없을 때 안내 */}
            {matchData.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  ℹ️ 이 계정은 최근 경기 기록이 없습니다. 다른 활동 중인 계정을 검색해보세요!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Match History */}
        {matchData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-green-500" />
              최근 경기 기록 ({matchData.length}게임)
            </h2>
            
            <div className="space-y-4">
              {matchData.map((match, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* 게임 기본 정보 */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${match.victory ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                        <span className={`font-semibold ${match.victory ? 'text-blue-600' : 'text-red-600'}`}>
                          {match.victory ? '승리' : '패배'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {match.queueType} • {getGameDuration(match.gameLength)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(match.gameDate)}
                      </p>
                    </div>

                    {/* 플레이어 통계 */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{match.championName}</p>
                          {/* 레벨 정보가 없으므로 숨김 */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="text-red-500" size={16} />
                          <span className="font-semibold">{match.kills}/{match.deaths}/{match.assists}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            KDA: {match.deaths > 0 ? ((match.kills + match.assists) / match.deaths).toFixed(2) : (match.kills + match.assists).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <TrendingUp className="mx-auto mb-1 text-green-500" size={16} />
                          <p className="font-medium">{match.cs || 0}</p>
                          <p className="text-gray-600">CS</p>
                          <p className="text-xs text-gray-400">미니언</p>
                        </div>
                        <div className="text-center">
                          <Coins className="mx-auto mb-1 text-yellow-500" size={16} />
                          <p className="font-medium">{match.goldEarned?.toLocaleString()}</p>
                          <p className="text-gray-600">골드</p>
                          <p className="text-xs text-gray-400">경제력</p>
                        </div>
                        <div className="text-center">
                          <Zap className="mx-auto mb-1 text-red-500" size={16} />
                          <p className="font-medium">{match.totalDamage?.toLocaleString()}</p>
                          <p className="text-gray-600">딜량</p>
                          <p className="text-xs text-gray-400">피해량</p>
                        </div>
                      </div>
                    </div>

                    {/* 아이템 정보는 백엔드에서 제공하지 않으므로 숨김 */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !playerData && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">게임 전적을 조회해보세요</h3>
            <p className="text-gray-600">게임 아이디와 태그를 입력하여 라이엇 게임 전적을 확인할 수 있습니다.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Riot Games API를 활용한 전적 조회 서비스
        </div>
      </div>
    </div>
  );
};

export default RiotGameData;