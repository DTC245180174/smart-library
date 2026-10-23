import React, { useState } from 'react';
import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const socialLinks = [
    {
      id: 'fb',
      name: 'Facebook',
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      hoverBg: '#1877f2',
      hoverShadow: '0 6px 16px rgba(24, 119, 242, 0.35)',
      url: '#'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: (
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverBg: '#0f172a',
      hoverBorder: '1px solid #0f172a',
      hoverShadow: '0 6px 16px rgba(15, 23, 42, 0.25)',
      url: '#'
    },
    {
      id: 'ig',
      name: 'Instagram',
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      hoverBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      hoverShadow: '0 6px 16px rgba(220, 39, 67, 0.35)',
      url: '#'
    },
    {
      id: 'yt',
      name: 'YouTube',
      icon: (
        <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      hoverBg: '#ff0000',
      hoverShadow: '0 6px 16px rgba(255, 0, 0, 0.35)',
      url: '#'
    }
  ];

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        color: '#64748b',
        padding: '52px 48px 36px 48px',
        borderTop: '1px solid #e2e8f0',
        marginTop: 'auto',
        boxSizing: 'border-box',
        width: '100%',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '32px',
          maxWidth: '1400px',
          margin: '0 auto',
          flexWrap: 'wrap'
        }}
      >
        {/* CỘT 1: THƯ VIỆN ĐIỆN TỬ & SOCIALS (Ở PHÍA TRÁI) */}
        <div style={{ flex: '1 1 280px', maxWidth: '360px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #dbeafe'
              }}
            >
              <BookOpen size={18} color="#2563eb" />
            </div>
            <h3 style={{ color: '#0f172a', fontSize: '17px', fontWeight: 700, margin: 0, letterSpacing: '0.2px' }}>
              Thư viện điện tử
            </h3>
          </div>
          <p
            style={{
              fontSize: '13px',
              lineHeight: '1.65',
              color: '#64748b',
              margin: '0 0 22px 0',
              maxWidth: '310px'
            }}
          >
            Nền tảng thư viện số hiện đại, cung cấp hàng ngàn đầu sách chất lượng cao, phục vụ nhu cầu học tập và nghiên cứu.
          </p>

          {/* Social Buttons với hiệu ứng hover sinh động */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {socialLinks.map((s) => {
              const isHovered = hoveredSocial === s.id;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  onClick={(e) => e.preventDefault()}
                  title={s.name}
                  onMouseEnter={() => setHoveredSocial(s.id)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: isHovered ? s.hoverBg : '#ffffff',
                    border: isHovered && s.hoverBorder ? s.hoverBorder : '1px solid #e2e8f0',
                    color: isHovered ? '#ffffff' : '#64748b',
                    textDecoration: 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-4px) scale(1.08)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered ? s.hoverShadow : '0 2px 5px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer'
                  }}
                >
                  {s.icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* BA MỤC NÀY: MỖI MỤC CÁCH NHAU 10PX VÀ DỒN VỀ PHÍA BÊN PHẢI */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            marginLeft: 'auto'
          }}
        >
          {/* MỤC 1: THƯ VIỆN */}
          <div style={{ minWidth: '140px', padding: '0 4px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '15.5px', fontWeight: 700, margin: '0 0 16px 0' }}>
              Thư viện
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {['Giới thiệu', 'Danh mục sách', 'Sách mới', 'Sách phổ biến'].map((item) => {
                const isHovered = hoveredLink === item;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredLink(item)}
                      onMouseLeave={() => setHoveredLink(null)}
                      style={{
                        color: isHovered ? '#2563eb' : '#64748b',
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        display: 'inline-block',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                        fontWeight: isHovered ? 600 : 400
                      }}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* MỤC 2: DỊCH VỤ */}
          <div style={{ minWidth: '160px', padding: '0 4px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '15.5px', fontWeight: 700, margin: '0 0 16px 0' }}>
              Dịch vụ
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {['Hướng dẫn mượn sách', 'Chính sách thư viện', 'Câu hỏi thường gặp', 'Liên hệ hỗ trợ'].map((item) => {
                const isHovered = hoveredLink === item;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredLink(item)}
                      onMouseLeave={() => setHoveredLink(null)}
                      style={{
                        color: isHovered ? '#2563eb' : '#64748b',
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        display: 'inline-block',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                        fontWeight: isHovered ? 600 : 400
                      }}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* MỤC 3: LIÊN HỆ */}
          <div style={{ minWidth: '240px', maxWidth: '300px', padding: '0 4px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '15.5px', fontWeight: 700, margin: '0 0 16px 0' }}>
              Liên hệ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Phone size={14} color="#2563eb" />
                </div>
                <span style={{ color: '#475569', fontWeight: 500 }}>(028) 3822 4526</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Mail size={14} color="#2563eb" />
                </div>
                <a
                  href="mailto:library@university.edu.vn"
                  style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
                >
                  library@university.edu.vn
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}
                >
                  <MapPin size={14} color="#2563eb" />
                </div>
                <span style={{ color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>
                  123 Lý Nam Đế, Phường Vạn Xuân, Phổ Yên, Thái Nguyên
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}