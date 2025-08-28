import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, MessageSquare, Calendar, User } from 'lucide-react';

const SimpleBoard = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    password: ''
  });

  // 초기 게시글 데이터
  useEffect(() => {
    const initialPosts = [
      {
        id: 1,
        title: '게시판 서비스 오픈!',
        author: '관리자',
        content: '간단한 게시판 서비스가 오픈되었습니다. 자유롭게 글을 작성해주세요!',
        createdAt: new Date('2025-08-09T10:00:00').toISOString(),
        views: 15,
        comments: []
      },
      {
        id: 2,
        title: 'React로 만든 게시판',
        author: '개발자',
        content: 'React와 Tailwind CSS를 사용해서 만든 게시판입니다. 반응형으로 제작되어 모바일에서도 잘 작동합니다.',
        createdAt: new Date('2025-08-09T11:30:00').toISOString(),
        views: 8,
        comments: [
          { id: 1, author: '사용자1', content: '깔끔하게 잘 만들어졌네요!', createdAt: new Date().toISOString() }
        ]
      }
    ];
    setPosts(initialPosts);
  }, []);

  const handleSubmit = () => {
    if (!formData.title || !formData.author || !formData.content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newPost = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      views: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setFormData({ title: '', author: '', content: '', password: '' });
    setShowForm(false);
  };

  const handlePostClick = (post) => {
    // 조회수 증가
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ));
    setSelectedPost(post);
  };

  const addComment = (postId, comment) => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: '익명',
      content: comment,
      createdAt: new Date().toISOString()
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setSelectedPost(prev => 
      prev.id === postId 
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <button 
              onClick={() => setSelectedPost(null)}
              className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
            >
              ← 목록으로 돌아가기
            </button>
            
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{selectedPost.views}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              댓글 ({selectedPost.comments.length})
            </h3>

            {/* Comment Form */}
            <div className="mb-6">
              <div>
                <textarea
                  id="commentInput"
                  placeholder="댓글을 입력하세요..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      const input = document.getElementById('commentInput');
                      if (input.value.trim()) {
                        addComment(selectedPost.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {selectedPost.comments.map(comment => (
                <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {selectedPost.comments.length === 0 && (
                <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">게시판</h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="제목, 작성자, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              글쓰기
            </button>
          </div>
        </div>

        {/* Write Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">새 글 작성</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="작성자"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="내용을 입력하세요..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
              />
              <input
                type="password"
                placeholder="비밀번호 (수정/삭제시 필요)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  작성완료
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? '검색 결과가 없습니다.' : '아직 게시글이 없습니다.'}
            </div>
          ) : (
            <>
              {/* Desktop Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
                <div className="col-span-6">제목</div>
                <div className="col-span-2">작성자</div>
                <div className="col-span-2">작성일</div>
                <div className="col-span-1">조회</div>
                <div className="col-span-1">댓글</div>
              </div>

              {/* Posts */}
              <div className="divide-y divide-gray-200">
                {filteredPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-2">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>{post.author}</span>
                          <span>{formatDate(post.createdAt).split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span>{post.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                      </div>
                      <div className="col-span-2 text-gray-600">{post.author}</div>
                      <div className="col-span-2 text-gray-600 text-sm">
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="col-span-1 text-gray-600 text-center">{post.views}</div>
                      <div className="col-span-1 text-gray-600 text-center">{post.comments.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Simple Board Service - Made with React & Tailwind CSS
        </div>
      </div>
    </div>
  );
};

export default SimpleBoard;
