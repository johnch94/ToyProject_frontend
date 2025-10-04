import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, Target, ChevronDown, ChevronUp, Sword, Coins, Activity, Clock, Calendar } from 'lucide-react';

const RiotGameData = () => {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedMatches, setExpandedMatches] = useState(new Set());

  // 검색 API 호출
  const handleSearch = async () => {
    if (!gameName || !tagLine) {
      alert('게임 이름과 태그를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/riot/player/${gameName}/${tagLine}/matches?count=5`
      );
      
      if (!response.ok) {
        throw new Error('플레이어를 찾을 수 없습니다.');
      }

      const result = await response.json();
      setPlayerData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 경기 펼치기/접기 토글
  const toggleMatch = (matchId) => {
    const newExpanded = new Set(expandedMatches);
    if (newExpanded.has(matchId)) {
      newExpanded.delete(matchId);
    } else {
      newExpanded.add(matchId);
    }
    setExpandedMatches(newExpanded);
  };

  // 날짜 포맷팅 (상대 시간)
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  // 게임 시간 포맷팅
  const formatGameLength = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* 검색 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">게임 전적 검색</h1>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="게임 이름 (예: Faker)"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="태그 (예: KR1)"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search size={20} />
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {/* 검색 결과 */}
        {playerData && (
          <div className="space-y-6">
            {/* 플레이어 요약 카드 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  👤 {playerData.player.gameName}#{playerData.player.tagLine}
                </h2>
                <span className="text-sm text-gray-500">최근 {playerData.stats.totalGames}경기</span>
              </div>

              {/* 통계 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 승률 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">승률</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {playerData.stats.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {playerData.stats.wins}승 {playerData.stats.losses}패
                  </div>
                </div>

                {/* 평균 KDA */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">평균 KDA</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {playerData.stats.averageKDA.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {(playerData.stats.totalKills / playerData.stats.totalGames).toFixed(1)} / 
                    {(playerData.stats.totalDeaths / playerData.stats.totalGames).toFixed(1)} / 
                    {(playerData.stats.totalAssists / playerData.stats.totalGames).toFixed(1)}
                  </div>
                </div>

                {/* 주력 챔피언 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sword size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">주력 챔피언</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {playerData.stats.mostPlayedChampion}
                  </div>
                </div>

                {/* 종합 평가 */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={20} className="text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">실력 평가</span>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {playerData.stats.winRate >= 70 ? '매우 좋음' :
                     playerData.stats.winRate >= 60 ? '좋음' :
                     playerData.stats.winRate >= 50 ? '보통' :
                     playerData.stats.winRate >= 40 ? '아쉬움' : '분발 필요'}
                  </div>
                </div>
              </div>
            </div>

            {/* 경기 목록 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 최근 경기 내역</h3>
              
              <div className="space-y-3">
                {playerData.matches.map((match) => (
                  <div key={match.matchId} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                    {/* 경기 요약 */}
                    <div
                      onClick={() => toggleMatch(match.matchId)}
                      className={`p-4 cursor-pointer ${match.victory ? 'bg-blue-50' : 'bg-red-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* 승패 */}
                          <div className={`text-2xl font-bold ${match.victory ? 'text-blue-600' : 'text-red-600'}`}>
                            {match.victory ? '✅ 승리' : '❌ 패배'}
                          </div>

                          {/* 챔피언 & KDA */}
                          <div>
                            <div className="font-bold text-gray-900">{match.championName}</div>
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">{match.kills}</span> / 
                              <span className="font-semibold text-red-600"> {match.deaths}</span> / 
                              <span className="font-semibold"> {match.assists}</span>
                              <span className="ml-2 text-gray-500">
                                (KDA {match.deaths > 0 ? ((match.kills + match.assists) / match.deaths).toFixed(2) : (match.kills + match.assists).toFixed(1)})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* 게임 정보 */}
                          <div className="text-right text-sm">
                            <div className="text-gray-700">{match.queueType}</div>
                            <div className="text-gray-500">{formatRelativeTime(match.gameDate)}</div>
                          </div>

                          {/* 펼치기 버튼 */}
                          {expandedMatches.has(match.matchId) ? (
                            <ChevronUp className="text-gray-400" size={24} />
                          ) : (
                            <ChevronDown className="text-gray-400" size={24} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 경기 상세 정보 (펼쳤을 때) */}
                    {expandedMatches.has(match.matchId) && (
                      <div className="p-4 bg-white border-t-2 border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Coins className="text-yellow-600" size={20} />
                            <div>
                              <div className="text-xs text-gray-500">획득 골드</div>
                              <div className="font-semibold">{match.goldEarned.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Activity className="text-red-600" size={20} />
                            <div>
                              <div className="text-xs text-gray-500">총 딜량</div>
                              <div className="font-semibold">{match.totalDamage.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Target className="text-green-600" size={20} />
                            <div>
                              <div className="text-xs text-gray-500">CS</div>
                              <div className="font-semibold">
                                {match.cs} 
                                <span className="text-xs text-gray-500 ml-1">
                                  ({(match.cs / (match.gameLength / 60)).toFixed(1)}/분)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="text-blue-600" size={20} />
                            <div>
                              <div className="text-xs text-gray-500">게임 시간</div>
                              <div className="font-semibold">{formatGameLength(match.gameLength)}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="text-purple-600" size={20} />
                            <div>
                              <div className="text-xs text-gray-500">게임 날짜</div>
                              <div className="font-semibold text-sm">
                                {new Date(match.gameDate).toLocaleString('ko-KR', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 초기 안내 메시지 */}
        {!playerData && !loading && !error && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Trophy className="mx-auto mb-4 text-blue-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              플레이어를 검색해보세요
            </h3>
            <p className="text-gray-500">
              게임 이름과 태그를 입력하면 최근 전적을 확인할 수 있습니다
            </p>
            <div className="mt-4 text-sm text-gray-400">
              예시: Faker #KR1
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiotGameData;
