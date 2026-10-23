import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, BookOpen, Sparkles } from 'lucide-react';

export default function FeaturedCarousel({ books, onSelectBook, onBorrowBook }) {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Pick 6 rotating books alternating per session
  useEffect(() => {
    // Loại trừ hoàn toàn sách sắp có / sắp phát hành khỏi danh sách đề xuất
    const eligibleBooks = (books || []).filter(
      b => b.status !== 'Upcoming' && 
           b.status !== 'Sắp phát hành' && 
           b.status !== 'Sắp có' && 
           !b.isUpcoming
    );
    if (!eligibleBooks || eligibleBooks.length === 0) return;

    // Use session-based rotation
    let seed = sessionStorage.getItem('smartlib_featured_seed');
    if (!seed) {
      seed = String(Date.now() % 1000);
      sessionStorage.setItem('smartlib_featured_seed', seed);
    }
    const seedNum = parseInt(seed) || 0;

    // Deterministic shuffle using seed so it stays consistent during the session, but alternates between logins
    const shuffled = [...eligibleBooks].sort((a, b) => {
      const hashA = (a.id * 9301 + seedNum * 49297) % 233280;
      const hashB = (b.id * 9301 + seedNum * 49297) % 233280;
      return hashA - hashB;
    });

    const chosen = shuffled.slice(0, 6);
    setFeaturedBooks(chosen);
    setCurrentIndex(0);
  }, [books]);

  // Auto slide every 5 seconds (5s)
  useEffect(() => {
    if (featuredBooks.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [featuredBooks, isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredBooks.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredBooks.length) % featuredBooks.length);
  };

  if (!featuredBooks || featuredBooks.length === 0) return null;

  const currentBook = featuredBooks[currentIndex];
  const nextBook = featuredBooks[(currentIndex + 1) % featuredBooks.length];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #fbfcfe 0%, #f4f6fa 100%)',
        borderRadius: '24px',
        border: '1px solid #eef2f6',
        padding: '36px 48px',
        marginBottom: '36px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
        minHeight: '260px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background Decorative Abstract Curves (Like Image 2) */}
      <svg
        style={{
          position: 'absolute',
          right: '5%',
          top: '-10%',
          width: '550px',
          height: '400px',
          opacity: 0.35,
          pointerEvents: 'none'
        }}
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="300" cy="150" r="140" stroke="#cbd5e1" strokeWidth="32" strokeDasharray="16 16" />
        <circle cx="280" cy="180" r="90" stroke="#e2e8f0" strokeWidth="24" />
        <path d="M150 250 C 220 180, 260 120, 350 140" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
      </svg>

      {/* Left Navigation Arrow Button (nằm ở giữa bên trái của cái div) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Book"
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#334155',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Navigation Arrow Button (nằm ở giữa bên phải của cái div) */}
      <button
        onClick={handleNext}
        aria-label="Next Book"
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#334155',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Main Content Area */}
      <div
        key={currentBook.id}
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          width: '100%',
          gap: '32px',
          padding: '0 20px',
          animation: 'fadeInSlide 0.4s ease-out'
        }}
      >
        {/* Left Info (Matching Image 2 styling) */}
        <div>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.25,
              marginBottom: '14px',
              letterSpacing: '-0.5px'
            }}
          >
            {currentBook.author ? `${currentBook.author}: ` : ''}
            <span
              style={{ color: '#2563eb', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              onClick={() => onSelectBook && onSelectBook(currentBook)}
              title={`Xem chi tiết sách: ${currentBook.title}`}
            >
              {currentBook.title}
            </span>
          </h1>

          <p
            style={{
              fontSize: '13.5px',
              color: '#64748b',
              lineHeight: 1.6,
              maxWidth: '460px',
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {currentBook.desc || 'Cuốn sách đặc sắc được tuyển chọn từ thư viện thông minh SmartLib dành riêng cho bạn.'}
          </p>

          {/* Action Button: Pill shape with Eye/Book icon matching Image 2 "Continue Reading" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => onBorrowBook ? onBorrowBook(currentBook) : onSelectBook(currentBook)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '50px',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.25s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={13} />
              </div>
              <span>Mượn sách ngay</span>
            </button>

            <button
              onClick={() => onSelectBook(currentBook)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 18px',
                borderRadius: '50px',
                background: 'transparent',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13.5px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <span>Xem chi tiết</span>
            </button>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '22px' }}>
            {featuredBooks.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '24px' : '7px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? '#2563eb' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Book Display with Layered 3D Covers (Matching Image 2) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '240px'
          }}
        >
          {/* Background Layer Book (Secondary book tilted slightly behind, just like Image 2) */}
          {nextBook && (
            <div
              style={{
                position: 'absolute',
                right: '120px',
                width: '130px',
                height: '185px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                transform: 'rotate(-6deg) translateY(-8px)',
                opacity: 0.85,
                transition: 'all 0.4s',
                background: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {nextBook.imageUrl ? (
                <img
                  src={nextBook.imageUrl}
                  alt={nextBook.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <BookOpen size={36} color="#94a3b8" />
              )}
            </div>
          )}

          {/* Main Foreground Book (Standing tall with shadow, like Image 2) */}
          <div
            onClick={() => onSelectBook(currentBook)}
            style={{
              position: 'relative',
              width: '165px',
              height: '225px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18), 0 4px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
          >
            {currentBook.imageUrl ? (
              <img
                src={currentBook.imageUrl}
                alt={currentBook.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                <BookOpen size={42} style={{ margin: '0 auto 8px', color: '#2563eb' }} />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>{currentBook.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}