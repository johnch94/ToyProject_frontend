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

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 로그인 페이지로 리다이렉트
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 회원 인증 API
export const authAPI = {
  // 회원가입
  signup: async (data) => {
    try {
      const response = await api.post('/api/auth/signup', data);
      return response.data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  },

  // 로그인
  login: async (data) => {
    try {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  // 아이디 중복 체크
  checkUsername: async (username) => {
    try {
      const response = await api.get(`/api/auth/check/username/${username}`);
      return response.data;
    } catch (error) {
      console.error('아이디 중복 체크 실패:', error);
      throw error;
    }
  },

  // 이메일 중복 체크
  checkEmail: async (email) => {
    try {
      const response = await api.get(`/api/auth/check/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
      throw error;
    }
  }
};

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