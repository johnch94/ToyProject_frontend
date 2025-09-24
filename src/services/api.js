import axios from 'axios';

// 백엔드 서버 URL
const BASE_URL = 'http://localhost:8081';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 서비스들
export const riotAPI = {
  // 플레이어 정보 및 매치 히스토리 통합 조회 (백엔드 API에 맞춤)
  getPlayerMatches: async (gameName, tagLine, count = 5) => {
    try {
      const response = await api.get(`/api/riot/player/${gameName}/${tagLine}/matches?count=${count}`);
      return response.data;
    } catch (error) {
      console.error('플레이어 전적 조회 실패:', error);
      throw error;
    }
  }
};

// 게시판 API (있다면)
export const boardAPI = {
  // 게시글 목록 조회
  getPosts: async () => {
    try {
      const response = await api.get('/api/posts');
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw error;
    }
  },

  // 게시글 작성
  createPost: async (postData) => {
    try {
      const response = await api.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  }
};

export default api;