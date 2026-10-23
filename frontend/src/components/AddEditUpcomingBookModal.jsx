import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Calendar, Tag, User, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Manga & Thể thao',
  'Light Novel & Kỳ ảo',
  'Kỳ ảo & Hành động',
  'Manga & Shounen',
  'Trinh thám & Bí ẩn',
  'Hành động & Siêu nhiên',
  'Khoa học & Công nghệ',
  'Kinh tế & Kỹ năng',
  'Văn học & Nghệ thuật',
  'Giáo trình & Tài liệu',
  'Khác'
];

export default function AddEditUpcomingBookModal({ isOpen, onClose, onSave, book }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Manga & Thể thao',
    releaseDate: '',
    expectedQuantity: 20,
    imageUrl: '',
    desc: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      // Extract releaseDate from desc if available
      let relDate = book.releaseDate || '';
      if (!relDate && book.desc && book.desc.includes('Dự kiến phát hành:')) {
        try {
          relDate = book.desc.split('Dự kiến phát hành:')[1].trim().split('.')[0].trim();
        } catch (e) {}
      }

      setFormData({
        title: book.title || '',
        author: book.author || '',
        category: book.category || 'Manga & Thể thao',
        releaseDate: relDate || '10-2026',
        expectedQuantity: Number(book.expectedQuantity || book.quantity || 20),
        imageUrl: book.imageUrl || '',
        desc: book.desc || book.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Manga & Thể thao',
        releaseDate: '10-2026',
        expectedQuantity: 20,
        imageUrl: '',
        desc: ''
      });
    }
    setError('');
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tên sách.');
      return;
    }
    if (!formData.author.trim()) {
      setError('Vui lòng nhập tên tác giả.');
      return;
    }
    if (!formData.releaseDate.trim()) {
      setError('Vui lòng nhập thời gian dự kiến phát hành / về thư viện.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let finalDesc = formData.desc.trim();
      if (finalDesc.includes('Dự kiến phát hành:')) {
        finalDesc = finalDesc.replace(/Dự kiến phát hành:\s*[^).\n]+([).\n]?)/, `Dự kiến phát hành: ${formData.releaseDate.trim()}$1`);
      } else {
        finalDesc = finalDesc ? `${finalDesc} (Dự kiến phát hành: ${formData.releaseDate.trim()})` : `Tác phẩm dự kiến phát hành và về kho thư viện vào: ${formData.releaseDate.trim()}.`;
      }

      await onSave({
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        releaseDate: formData.releaseDate.trim(),
        expectedQuantity: Number(formData.expectedQuantity) || 20,
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
        desc: finalDesc,
        description: finalDesc,
        status: 'Sắp phát hành',
        isUpcoming: true,
        quantity: 0,
        available: 0
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thông tin sách đặt trước.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          margin: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to right, #eff6ff, #f8fafc)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                {book ? 'Chỉnh sửa Sách Đặt Trước' : 'Thêm Sách Sắp Về (Đặt Trước)'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Quản lý thông tin và kế hoạch nhập kho sách sắp phát hành
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              {/* Tên sách */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tên sách / Tác phẩm <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Thám Tử Lừng Danh Conan - Tuyển Tập 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <BookOpen size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Tác giả */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tác giả <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Gosho Aoyama"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Thể loại */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Thể loại
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Tag size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Ngày dự kiến phát hành */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Dự kiến phát hành / Về kho <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 10-2026 hoặc 15-11-2026"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Số lượng dự kiến nhập kho */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Số lượng dự kiến nhập (cuốn)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.expectedQuantity}
                    onChange={(e) => setFormData({ ...formData, expectedQuantity: parseInt(e.target.value) || 1 })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <Layers size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Ảnh bìa */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Đường dẫn ảnh bìa sách (Image URL)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 34px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                    <ImageIcon size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                  {formData.imageUrl && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
                      <img src={formData.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Tóm tắt / Mô tả */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tóm tắt nội dung & Giới thiệu
                </label>
                <textarea
                  rows="3"
                  placeholder="Mô tả nội dung tác phẩm, sự kiện xuất bản đáng chú ý..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              background: '#f8fafc'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-outline"
              style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '8px 22px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isSubmitting ? 'Đang lưu...' : (book ? 'Cập nhật sách' : 'Thêm vào kho đặt trước')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

