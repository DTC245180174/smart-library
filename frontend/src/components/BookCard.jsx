import React from 'react';
import { BookOpen, Star, StarHalf, QrCode } from 'lucide-react';

// Hệ thống tự động đánh giá số sao cho từng cuốn sách (từ 3.5 đến 5.0 sao)
function getSystemRating(book) {
  if (book.rating) return Number(book.rating);
  const id = Number(book.id) || 1;
  const borrowed = Number(book.borrowed) || 0;
  // Tính điểm đánh giá tự động dựa trên độ phổ biến và mã sách
  const seed = (id * 37 + borrowed * 13) % 15;
  const rating = 3.6 + (seed / 10);
  return Math.min(5.0, Math.max(3.5, Math.round(rating * 10) / 10));
}

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Sao đầy đủ
      stars.push(
        <Star key={i} size={11.5} fill="#eab308" color="#eab308" style={{ flexShrink: 0 }} />
      );
    } else if (rating >= i - 0.5) {
      // Nửa sao: giữ trọn vẹn khung viền của nửa sao còn lại
      stars.push(
        <div
          key={i}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '11.5px',
            height: '11.5px',
            flexShrink: 0
          }}
        >
          {/* Khung toàn bộ ngôi sao màu vàng */}
          <Star size={11.5} fill="#fefce8" color="#eab308" style={{ display: 'block' }} />
          {/* Lớp phủ 50% bên trái tô vàng đặc */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            <Star size={11.5} fill="#eab308" color="#eab308" style={{ flexShrink: 0 }} />
          </div>
        </div>
      );
    } else {
      // Sao chưa đạt: hiện khung viền
      stars.push(
        <Star key={i} size={11.5} fill="none" color="#cbd5e1" style={{ flexShrink: 0 }} />
      );
    }
  }
  return stars;
}

export default function BookCard({ book, onSelect, onBorrow, isAdmin }) {
  const qty = Number(book.quantity) || 1;
  const borrowed = Number(book.borrowed) || 0;
  const available = Math.max(0, qty - borrowed);
  const isAvailable = available > 0;
  const systemRating = getSystemRating(book);

  return (
    <div
      onClick={() => onSelect(book)}
      style={{
        background: '#ffffff',
        border: '1px solid #eef2f6',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        userSelect: 'none',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.02)';
        e.currentTarget.style.borderColor = '#eef2f6';
      }}
    >
      {/* 1. Complete Book Cover (No Cropping) */}
      <div
        style={{
          width: '100%',
          height: '240px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 8px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))',
              borderRadius: '4px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', gap: '6px' }}>
            <BookOpen size={40} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Không có ảnh bìa</span>
          </div>
        )}

        {/* Stock Badge (Optional top-right indicator) */}
        {!isAvailable && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(239, 68, 68, 0.92)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              backdropFilter: 'blur(4px)'
            }}
          >
            Hết sách
          </div>
        )}
      </div>

      {/* 2. Content Info Section (Matching Image 2) */}
      <div
        style={{
          padding: '12px 14px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          background: '#ffffff'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.35,
              margin: '0 0 3px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.textDecoration = 'none';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
            title={`Xem chi tiết sách: ${book.title}`}
          >
            {book.title}
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#64748b',
              margin: '0 0 10px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={book.author}
          >
            {book.author || 'Chưa rõ tác giả'}
          </p>
        </div>

        {/* 3. Footer Row: Star Rating with (<số lượt mượn sách>) & "Xem »" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '8px',
            marginTop: '4px'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
            title={`Hệ thống đánh giá: ${systemRating} / 5.0 sao`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5px', color: '#eab308' }}>
              {renderStars(systemRating)}
            </div>
            <span
              style={{
                color: '#64748b',
                fontSize: '11px',
                fontWeight: 600,
                marginLeft: '3px'
              }}
            >
              ({borrowed.toLocaleString()})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2.5px',
                color: '#0f766e',
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontWeight: 700
              }}
              title={`Mã QR Sách #${book.id}`}
            >
              <QrCode size={11} /> QR
            </span>
            <span
              style={{
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.2px'
              }}
            >
              Xem »
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}