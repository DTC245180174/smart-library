import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, BookOpen } from 'lucide-react';

const UPCOMING_BOOKS = [
  {
    id: 51,
    title: 'Ao no Hako Season 2',
    author: 'Kouji Miura',
    rating: 9.6,
    releaseDate: '04-10-2026',
    views: '114,874',
    cover: 'https://cdn.myanimelist.net/images/anime/1341/145349.jpg',
    category: 'Manga & Thể thao',
    desc: 'Tác phẩm truyện tranh thể thao học đường đình đám kết hợp cầu lông và bóng rổ. Phần tiếp theo khai thác giải đấu liên trường quốc gia và những cung bậc cảm xúc lãng mạn tuổi trẻ.'
  },
  {
    id: 52,
    title: 'Tensei Kizoku, Kantei Skill de Nariagaru',
    author: 'Miraijin A',
    rating: 8.8,
    releaseDate: '10-2026',
    views: '214,443',
    cover: 'https://cdn.myanimelist.net/images/anime/1763/139538.jpg',
    category: 'Light Novel & Kỳ ảo',
    desc: 'Hành trình phát triển lãnh địa của quý tộc Ars Louvent nhờ kỹ năng thẩm định thần thánh chiêu mộ hiền tài bảo vệ vương quốc.'
  },
  {
    id: 53,
    title: 'Ma Thuật Đặc Biệt Của Pháp Sư Tái Sinh',
    author: 'Yuusan',
    rating: 9.4,
    releaseDate: '10-2026',
    views: '85,746',
    cover: 'https://cdn.myanimelist.net/images/anime/1222/145668.jpg',
    category: 'Kỳ ảo & Hành động',
    desc: 'Pháp sư tài ba thức tỉnh sau hàng thế kỷ trong thời đại ma thuật mới suy tàn và bắt đầu hành trình cải cách ma pháp học viện.'
  },
  {
    id: 54,
    title: 'Black Clover: Đại Chiến Ma Pháp',
    author: 'Yūki Tabata',
    rating: 9.6,
    releaseDate: '10-2026',
    views: '196,239',
    cover: 'https://cdn.myanimelist.net/images/anime/2/88336.jpg',
    category: 'Manga & Shounen',
    desc: 'Cuộc đại chiến ma pháp tối hậu của vương quốc Tam Diệp chống lại các thế lực cổ xưa. Asta tiếp tục bước đi trên con đường trở thành Ma Pháp Vương.'
  },
  {
    id: 55,
    title: 'Thám Tử Lừng Danh Conan - Tuyển Tập 2026',
    author: 'Gosho Aoyama',
    rating: 8.7,
    releaseDate: '11-2026',
    views: '226,521',
    cover: 'https://cdn.myanimelist.net/images/anime/7/75199.jpg',
    category: 'Trinh thám & Bí ẩn',
    desc: 'Tuyển tập những vụ án hóc búa nhất của thám tử Edogawa Conan và đối đầu kịch tính cùng Tổ chức Áo đen trong năm 2026.'
  },
  {
    id: 56,
    title: 'Thám Tử Đã Chết 2 (Tantei wa Mou, Shindeiru)',
    author: 'Nigojū',
    rating: 9.1,
    releaseDate: '11-2026',
    views: '641,147',
    cover: 'https://cdn.myanimelist.net/images/anime/1843/115815.jpg',
    category: 'Light Novel & Trinh thám',
    desc: 'Kimizuka Kimihiko tiếp tục khám phá bí mật đằng sau sự ra đi của nữ thám tử thiên tài Siesta và cuộc chiến với tổ chức SPES.'
  },
  {
    id: 57,
    title: 'Chuyển Sinh Thành Kiếm - Đại Lộ Kiếm Vũ',
    author: 'Yuu Tanaka',
    rating: 9.6,
    releaseDate: '11-2026',
    views: '155,757',
    cover: 'https://cdn.myanimelist.net/images/anime/1191/127909.jpg',
    category: 'Kỳ ảo & Phiêu lưu',
    desc: 'Hành trình vượt qua các đại lục mới của thanh ma kiếm thông minh và cô bé người mèo Fran.'
  },
  {
    id: 58,
    title: 'Dragon Ball Super: Bí Ẩn Đa Vũ Trụ Mới',
    author: 'Akira Toriyama & Toyotarou',
    rating: 9.1,
    releaseDate: '12-2026',
    views: '600,202',
    cover: 'https://cdn.myanimelist.net/images/anime/7/74606.jpg',
    category: 'Hành động & Siêu nhiên',
    desc: 'Goku và Vegeta tiếp cận cảnh giới sức mạnh mới trước sự xuất hiện của những thực thể quyền năng bí ẩn từ vũ trụ xa xôi.'
  },
  {
    id: 59,
    title: 'Majo no Tabitabi: Hành Trình Elaina 2026',
    author: 'Jougi Shiraishi',
    rating: 9.6,
    releaseDate: '12-2026',
    views: '374,986',
    cover: 'https://cdn.myanimelist.net/images/anime/1802/108501.jpg',
    category: 'Light Novel & Du ký',
    desc: 'Những mẩu chuyện phiêu lưu lắng đọng và kỳ thú của Phù thủy Tro Tàn Elaina qua các vùng đất huyền bí.'
  },
  {
    id: 60,
    title: 'Jujutsu Kaisen: Kỷ Nguyên Hậu Phong Ấn',
    author: 'Gege Akutami',
    rating: 9.8,
    releaseDate: '12-2026',
    views: '890,120',
    cover: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    category: 'Shounen & Siêu nhiên',
    desc: 'Kỷ nguyên đỉnh cao của chú thuật sư và nguyền hồn sau khi phong ấn ngục môn cương được giải trừ.'
  }
];

export { UPCOMING_BOOKS };

export default function UpcomingBooksSection({ books = [], onSelectBook, onReserve, onCancelReserve, reservedBookIds = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [subscribedIds, setSubscribedIds] = useState([]);

  // Đồng bộ danh sách sách đã đặt trước từ tài khoản độc giả
  useEffect(() => {
    if (reservedBookIds && Array.isArray(reservedBookIds)) {
      setSubscribedIds(reservedBookIds);
    } else {
      setSubscribedIds([]);
    }
  }, [reservedBookIds]);

  // Lấy danh sách sách đặt trước / sắp có từ CSDL (books prop từ ReaderPortal)
  const upcomingFromDb = (books || []).filter(b => 
    b.isUpcoming || 
    b.status === 'Sắp phát hành' || 
    b.status === 'Sắp có' || 
    b.status === 'Upcoming' || 
    (Number(b.id) >= 51 && b.isUpcoming !== false && b.status !== 'Sẵn sàng' && b.status !== 'Hết sách' && b.status !== 'Bảo trì')
  ).map(b => {
    let relDate = b.releaseDate;
    if (!relDate && (b.desc || b.description)) {
      const match = (b.desc || b.description).match(/Dự kiến phát hành:\s*([^).\n]+)/);
      if (match) relDate = match[1].trim();
    }
    const fallbackCover = UPCOMING_BOOKS.find(ub => Number(ub.id) === Number(b.id))?.cover;
    return {
      id: Number(b.id),
      title: b.title,
      author: b.author || 'Chưa rõ',
      rating: b.rating || 9.5,
      releaseDate: relDate || '10-2026',
      views: b.views || '120,000',
      cover: b.imageUrl || b.cover || fallbackCover || '',
      imageUrl: b.imageUrl || b.cover || fallbackCover || '',
      category: b.category || 'Manga & Light Novel',
      desc: b.desc || b.description || '',
      status: b.status || 'Sắp có',
      isUpcoming: true
    };
  });

  const allUpcoming = upcomingFromDb.length > 0 ? upcomingFromDb : UPCOMING_BOOKS;
  const displayedBooks = showAll ? allUpcoming : allUpcoming.slice(0, 5);

  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px 28px 28px',
        marginBottom: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        color: '#0f172a',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Header Tag màu xanh dương #2563eb đồng bộ thương hiệu SmartLib */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>SẮP CÓ</span>
            <ChevronRight size={15} strokeWidth={3} />
          </button>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Kho sách bản quyền & Light Novel chuẩn bị có mặt tại thư viện
          </span>
        </div>

      </div>

      {/* Grid 5 cột chuẩn bố cục: Giãn đều 100% đồng bộ với danh sách sách chính */}
      <div className="upcoming-books-grid">
        {displayedBooks.map((item) => {
          const isSubscribed = subscribedIds.includes(item.id) || (reservedBookIds && reservedBookIds.includes(item.id));

          return (
            <div
              key={item.id}
              onClick={() => onSelectBook && onSelectBook({ ...item, isReserved: isSubscribed })}
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
              {/* 1. Bìa sách nguyên vẹn chuẩn BookCard (Không cắt xén, nền nhẹ, bóng đổ tinh tế) */}
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
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
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
                    loading="lazy"
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', gap: '6px' }}>
                    <BookOpen size={40} />
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Không có ảnh bìa</span>
                  </div>
                )}

                {/* Huy hiệu Sắp có / Đã đặt ở góc trên bên phải */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: isSubscribed ? 'rgba(22, 163, 74, 0.92)' : 'rgba(37, 99, 235, 0.92)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2.5px 8px',
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                    letterSpacing: '0.2px'
                  }}
                >
                  {isSubscribed ? '✓ Đã đặt' : 'Sắp có'}
                </div>
              </div>

              {/* 2. Phần thông tin sách (Tiêu đề sách & Tác giả) */}
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
                    title={item.title}
                  >
                    {item.title}
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
                    title={item.author}
                  >
                    {item.author || 'Chưa rõ tác giả'}
                  </p>
                </div>

                {/* 3. Footer: Thời gian dự kiến có truyện (ngày-tháng-năm / tháng-năm) & Nút Xem » */}
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
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#2563eb',
                      background: '#eff6ff',
                      border: '1px solid #dbeafe',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                    title={`Dự kiến có truyện: ${item.releaseDate}`}
                  >
                    <Calendar size={12} strokeWidth={2.4} />
                    <span>{item.releaseDate}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectBook) onSelectBook({ ...item, isReserved: isSubscribed });
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.2px',
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.color = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                      title={`Xem thông tin và đặt trước "${item.title}"`}
                    >
                      Xem »
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nút XEM THÊM.. ở đáy phong cách SmartLib */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setShowAll(prev => !prev)}
          style={{
            background: '#f8fafc',
            color: '#2563eb',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '9px 40px',
            fontSize: '12.5px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#eff6ff';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#bfdbfe';
          }}
        >
          {showAll ? 'THU GỌN' : 'XEM THÊM..'}
        </button>
      </div>
    </section>
  );
}
