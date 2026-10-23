import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

// Helper function to remove Vietnamese accents for fuzzy matching
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

export default function SearchModal({ isOpen, onClose, books, onSelectBook, onBorrowBook, isAdmin }) {
  const [query, setQuery] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      // Pick 7-8 recommended books
      if (books && books.length > 0) {
        setRecommendedBooks(books.slice(0, 8));
      }
    }
  }, [isOpen, books]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time filtering & smart ranking based on keyboard input
  const cleanQuery = removeVietnameseTones(query);
  const rawQuery = query.trim().toLowerCase();

  let searchResults = [];
  if (rawQuery) {
    const scoredBooks = books.map(book => {
      const cleanTitle = removeVietnameseTones(book.title || '');
      const cleanAuthor = removeVietnameseTones(book.author || '');
      const cleanCategory = removeVietnameseTones(book.category || '');
      const cleanDesc = removeVietnameseTones(book.desc || '');

      let score = 0;

      // Exact title match gets highest score
      if (cleanTitle === cleanQuery) {
        score += 100;
      } else if (cleanTitle.startsWith(cleanQuery)) {
        score += 80;
      } else if (cleanTitle.includes(cleanQuery)) {
        score += 60;
      }

      // Author match
      if (cleanAuthor.startsWith(cleanQuery)) {
        score += 50;
      } else if (cleanAuthor.includes(cleanQuery)) {
        score += 35;
      }

      // Category match
      if (cleanCategory.includes(cleanQuery)) {
        score += 20;
      }

      // Description match
      if (cleanDesc.includes(cleanQuery)) {
        score += 10;
      }

      // Character sequence / word match
      const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
      let wordMatches = 0;
      queryWords.forEach(w => {
        if (cleanTitle.includes(w)) wordMatches += 15;
        if (cleanAuthor.includes(w)) wordMatches += 8;
      });
      score += wordMatches;

      return { book, score };
    });

    searchResults = scoredBooks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.book);
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        alignItems: 'flex-start',
        paddingTop: '60px',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '740px',
          maxHeight: '85vh',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          overflow: 'hidden'
        }}
      >
        {/* Search Header Input Bar */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: '#ffffff'
          }}
        >
          <Search size={22} style={{ color: '#2563eb', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Gõ tên sách, tác giả hoặc thể loại để tìm kiếm tức thì..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              width: '100%',
              background: 'transparent',
              padding: 0
            }}
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
            >
              <X size={18} />
            </button>
          ) : (
            <span style={{ fontSize: '11px', color: '#94a3b8', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              ESC để đóng
            </span>
          )}
        </div>

        {/* Search Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, maxHeight: 'calc(85vh - 90px)' }}>
          {/* CASE 1: Query is empty -> Display 7-8 Recommended Books */}
          {!rawQuery ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={16} style={{ color: '#2563eb' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Gợi ý 8 cuốn sách tiêu biểu dành cho bạn
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                {recommendedBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => { onClose(); onSelectBook(book); }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #eef2f6',
                      borderRadius: '12px',
                      padding: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#eef2f6'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '130px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        marginBottom: '8px'
                      }}
                    >
                      {book.imageUrl ? (
                        <img src={book.imageUrl} alt={book.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <BookOpen size={28} color="#cbd5e1" />
                      )}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={book.title}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {book.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* CASE 2: User is typing -> Realtime Filtered Results */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Tìm thấy <strong>{searchResults.length}</strong> cuốn sách phù hợp với từ khóa "<strong>{query}</strong>"
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <BookOpen size={42} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>Không tìm thấy cuốn sách nào khớp với "{query}"</h4>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Hãy thử tìm theo tên tác giả hoặc các từ khóa ngắn gọn hơn.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {searchResults.map(book => {
                    const qty = Number(book.quantity) || 1;
                    const borrowed = Number(book.borrowed) || 0;
                    const avail = Math.max(0, qty - borrowed);

                    return (
                      <div
                        key={book.id}
                        onClick={() => { onClose(); onSelectBook(book); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid #eef2f6',
                          background: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          gap: '16px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#2563eb'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#eef2f6'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: '42px',
                              height: '56px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px',
                              flexShrink: 0
                            }}
                          >
                            {book.imageUrl ? (
                              <img src={book.imageUrl} alt={book.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                              <BookOpen size={18} color="#94a3b8" />
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span className="badge badge-info" style={{ fontSize: '10px', padding: '1px 6px' }}>{book.category}</span>
                              <span style={{ fontSize: '11px', color: avail > 0 ? '#16a34a' : '#ef4444', fontWeight: 600 }}>
                                {avail > 0 ? `Còn ${avail} cuốn` : 'Hết sách'}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {book.title}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Tác giả: {book.author || 'Chưa rõ'}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          {!isAdmin && avail > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onBorrowBook(book);
                              }}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', background: '#2563eb' }}
                            >
                              Mượn
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onSelectBook(book);
                            }}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}