import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Coins, Activity, Clock, Calendar } from 'lucide-react';

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const puuid = searchParams.get('puuid');

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 신규 API 호출
  useEffect(() => {
    if (!matchId || !puuid) {
      setError('잘못된 접근입니다.');
      setLoading(false);
      return;
    }

    const fetchMatchDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/riot/match/${matchId}?puuid=${puuid}`
        );

        if (!response.ok) {
          throw new Error('경기 정보를 가져올 수 없습니다.');
        }

        const result = await response.json();
        setMatchData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetail();
  }, [matchId, puuid]);

  // 게임 시간 포맷팅
  const formatGameLength = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">경기 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러
  if (error || !matchData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => navigate('/riot')}
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} />
            목록으로 돌아가기
          </button>
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-red-600 text-xl font-semibold">❌ {error || '데이터를 불러올 수 없습니다.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/riot')}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          목록으로 돌아가기
        </button>

        {/* 경기 상세 정보 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className={`p-8 ${matchData.victory ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {matchData.victory ? '✅ 승리' : '❌ 패배'}
                </h1>
                <p className="text-xl opacity-90">
                  👤 {matchData.gameName}#{matchData.tagLine}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{matchData.championName}</p>
                <p className="text-sm opacity-75">{matchData.queueType}</p>
              </div>
            </div>
          </div>

          {/* KDA 큰 표시 */}
          <div className="p-8 border-b">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">전투 기록</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">킬</div>
                <div className="text-4xl font-bold text-green-600">{matchData.kills}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">데스</div>
                <div className="text-4xl font-bold text-red-600">{matchData.deaths}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">어시스트</div>
                <div className="text-4xl font-bold text-blue-600">{matchData.assists}</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-lg text-gray-600">
                평균 KDA: <span className="font-bold text-purple-600">
                  {matchData.deaths > 0 
                    ? ((matchData.kills + matchData.assists) / matchData.deaths).toFixed(2) 
                    : (matchData.kills + matchData.assists).toFixed(1)}
                </span>
              </span>
            </div>
          </div>

          {/* 상세 통계 */}
          <div className="p-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">상세 통계</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 획득 골드 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="text-yellow-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">획득 골드</span>
                </div>
                <div className="text-2xl font-bold text-yellow-700">
                  {matchData.goldEarned.toLocaleString()}
                </div>
              </div>

              {/* 총 딜량 */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-red-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">총 딜량</span>
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {matchData.totalDamage.toLocaleString()}
                </div>
              </div>

              {/* CS */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">CS</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {matchData.cs}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  분당 {(matchData.cs / (matchData.gameLength / 60)).toFixed(1)}
                </div>
              </div>

              {/* 게임 시간 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">게임 시간</span>
                </div>
                <div className="text-xl font-bold text-blue-700">
                  {formatGameLength(matchData.gameLength)}
                </div>
              </div>

              {/* 게임 날짜 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">게임 날짜</span>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {new Date(matchData.gameDate).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 경기 정보 */}
          <div className="p-8 bg-gray-50 border-t">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Match ID: {matchData.matchId}</span>
              <span>PUUID: {matchData.puuid.substring(0, 20)}...{matchData.puuid.substring(matchData.puuid.length - 10)}</span>
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>🔗 이 URL을 공유하면 다른 사람도 이 경기를 볼 수 있습니다</p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;
