import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 아이디 중복 체크
  const checkUsername = async () => {
    if (!formData.username.trim()) return;
    
    setCheckingUsername(true);
    try {
      const response = await authAPI.checkUsername(formData.username);
      
      // 응답 구조: { success: true, data: true/false }
      if (response.success) {
        if (!response.data) {
          // data가 false면 이미 사용 중
          setErrors(prev => ({ ...prev, username: '이미 사용 중인 아이디입니다.' }));
        } else {
          // data가 true면 사용 가능
          setErrors(prev => ({ ...prev, username: '' }));
        }
      }
    } catch (err) {
      console.error('중복 체크 실패:', err);
    } finally {
      setCheckingUsername(false);
    }
  };

  // 이메일 중복 체크
  const checkEmail = async () => {
    if (!formData.email.trim()) return;
    
    setCheckingEmail(true);
    try {
      const response = await authAPI.checkEmail(formData.email);
      
      // 응답 구조: { success: true, data: true/false }
      if (response.success) {
        if (!response.data) {
          // data가 false면 이미 사용 중
          setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
        } else {
          // data가 true면 사용 가능
          setErrors(prev => ({ ...prev, email: '' }));
        }
      }
    } catch (err) {
      console.error('중복 체크 실패:', err);
    } finally {
      setCheckingEmail(false);
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 아이디 검사
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요.';
    } else if (formData.username.length < 3) {
      newErrors.username = '아이디는 3자 이상이어야 합니다.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.';
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(formData.password)) {
      newErrors.password = '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검사
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    // 이메일 검사
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API 호출
      const response = await authAPI.signup({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: 'USER'
      });
      
      // 응답 구조: { success: true, message: "...", data: { userId, username, email, ... } }
      if (response.success) {
        console.log('회원가입 성공:', response.data);
        alert(`회원가입 성공! 로그인 페이지로 이동합니다.\n아이디: ${response.data.username}`);
        navigate('/login');
      } else {
        setErrors({ submit: '회원가입에 실패했습니다.' });
      }
      
    } catch (err) {
      console.error('회원가입 에러:', err);
      
      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      } else if (err.response?.status === 400) {
        setErrors({ submit: '입력 정보를 확인해주세요.' });
      } else {
        setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <UserPlus className="text-purple-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
          <p className="text-gray-600 mt-2">새로운 계정을 만드세요</p>
        </div>

        {/* 전체 에러 메시지 */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 입력 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={checkUsername}
                placeholder="아이디를 입력하세요 (3자 이상)"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {checkingUsername && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.username}
              </p>
            )}
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400" size={20} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={checkEmail}
                placeholder="example@email.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {checkingEmail && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8자 이상 (대소문자, 숫자, 특수문자 포함)"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.passwordConfirm ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {formData.password && formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              )}
            </div>
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all mt-6 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                회원가입 중...
              </span>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 로그인 링크 */}
        <div className="text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
