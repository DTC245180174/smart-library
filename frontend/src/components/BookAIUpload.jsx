import React, { useState, useRef } from 'react';
import { 
  Sparkles, Upload, CheckCircle2, AlertCircle, 
  X, Tag, Loader2, BookOpen, Hash, Calendar, Building2, User, Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function BookAIUpload({ onBookCreated, onCancel }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Form State (Human-in-the-loop để Admin rà soát & chỉnh sửa trước khi lưu)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Công nghệ',
    publisher: '',
    publishYear: new Date().getFullYear(),
    quantity: 5,
    description: '',
    ai_tags: [],
    cover: '',
  });

  // Xử lý khi chọn file ảnh bìa
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP)!');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setExtractedData(null);
  };

  // Kéo thả file
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setErrorMessage('');
    }
  };

  // Gọi API AI bóc tách thông tin
  const handleExtractAI = async () => {
    if (!selectedFile) {
      setErrorMessage('Vui lòng chọn hoặc tải lên ảnh bìa sách trước!');
      return;
    }

    setIsLoading(true);
    setIsExtracting(true);
    setErrorMessage('');

    try {
      const data = await api.extractBookWithAI(selectedFile);
      setExtractedData(data);

      // Đổ dữ liệu trích xuất vào Form để Admin rà soát
      setFormData({
        title: data.title || '',
        author: data.author || '',
        category: data.category || 'Công nghệ',
        publisher: data.publisher || '',
        publishYear: data.publish_year || new Date().getFullYear(),
        quantity: 5,
        description: data.description || '',
        ai_tags: data.ai_tags && data.ai_tags.length > 0 ? data.ai_tags : ['AI biên mục'],
        cover: data.cover_preview || previewUrl,
      });
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Lỗi kết nối hoặc quá thời gian chờ (timeout) khi bóc tách ảnh bằng AI. Vui lòng thử lại!';
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
      setIsExtracting(false);
    }
  };

  // Thêm tag mới
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !formData.ai_tags.includes(val)) {
        setFormData(prev => ({ ...prev, ai_tags: [...prev.ai_tags, val] }));
      }
      setTagInput('');
    }
  };

  // Xóa tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      ai_tags: prev.ai_tags.filter(t => t !== tagToRemove)
    }));
  };

  // Submit lưu sách vào CSDL (gọi API tạo sách gốc của hệ thống)
  const handleSubmitSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      setErrorMessage('Tên sách và Tác giả không được để trống!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        publisher: formData.publisher.trim() || 'NXB Thông tin & Truyền thông',
        publishYear: Number(formData.publishYear) || new Date().getFullYear(),
        quantity: Number(formData.quantity) || 1,
        available: Number(formData.quantity) || 1,
        borrowed: 0,
        description: formData.description.trim(),
        cover: formData.cover || previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        imageUrl: formData.cover || previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        status: 'Sẵn sàng',
        rating: 9.0,
        tags: formData.ai_tags.join(', '),
      };

      const savedBook = await api.createBook(payload);

      if (onBookCreated) {
        onBookCreated(savedBook || payload);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Không thể lưu sách vào CSDL. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '26px 30px',
      boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
      maxWidth: '850px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI Tự Động Biên Mục Sách (AI Cataloging)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              Quét ảnh bìa để tự động trích xuất Tựa đề, Tác giả, Nhà xuất bản & Gợi ý Tags
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          color: '#dc2626',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '18px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Khu vực Upload & Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: previewUrl ? '260px 1fr' : '1fr',
        gap: '20px',
        marginBottom: '22px'
      }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: previewUrl ? '1.5px solid #cbd5e1' : '2px dashed #818cf8',
            borderRadius: '14px',
            padding: '20px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: previewUrl ? '#ffffff' : '#f5f3ff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '220px'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {previewUrl ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <img
                src={previewUrl}
                alt="Bìa sách xem trước"
                style={{
                  maxHeight: '190px',
                  maxWidth: '100%',
                  borderRadius: '10px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <div style={{ fontSize: '12px', color: '#4f46e5', marginTop: '10px', fontWeight: 700 }}>
                Nhấp để đổi ảnh khác
              </div>
            </div>
          ) : (
            <>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Upload size={24} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                Chọn hoặc kéo thả ảnh bìa sách
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 10MB)
              </div>
            </>
          )}
        </div>

        {/* Nút trigger AI Scanner */}
        {previewUrl && !extractedData && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px',
            background: '#faf5ff',
            borderRadius: '14px',
            border: '1px solid #f3e8ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#7c3aed" />
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Ảnh bìa đã sẵn sàng phân tích
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '18px' }}>
              Mô hình AI sẽ tự động trích xuất thông tin bìa sách theo cơ chế <strong>Human-in-the-loop</strong>:
              kết quả sẽ được điền vào form để bạn rà soát và tinh chỉnh trước khi lưu vào CSDL.
            </p>
            <button
              type="button"
              onClick={handleExtractAI}
              disabled={isLoading || isExtracting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '10px',
                background: (isLoading || isExtracting) ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: (isLoading || isExtracting) ? 'not-allowed' : 'pointer',
                boxShadow: (isLoading || isExtracting) ? 'none' : '0 6px 18px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {isLoading || isExtracting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang xử lý AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Bắt đầu trích xuất bằng AI</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Form Human-in-the-loop sau khi AI trích xuất xong */}
      {extractedData && (
        <form onSubmit={handleSubmitSave} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '10px 14px',
            borderRadius: '10px'
          }}>
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              AI đã trích xuất thành công (Độ tin cậy: {Math.round((extractedData.confidence || 0.85) * 100)}%)
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Bạn có thể tùy ý sửa đổi mọi trường bên dưới:
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <BookOpen size={14} color="#6366f1" /> Tên sách *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #6366f1',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <User size={14} color="#6366f1" /> Tác giả *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <Layers size={14} color="#6366f1" /> Thể loại
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                {['Công nghệ', 'Kinh tế', 'Văn học', 'Kỹ năng sống', 'Khoa học', 'Lịch sử', 'Ngoại ngữ', 'Khác'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <Building2 size={14} color="#6366f1" /> Nhà xuất bản
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="VD: NXB Thông tin & Truyền thông, NXB Trẻ..."
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <Calendar size={14} color="#6366f1" /> Năm xuất bản
              </label>
              <input
                type="number"
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || new Date().getFullYear() })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                <Hash size={14} color="#6366f1" /> Số lượng nhập kho
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* AI Tags */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <Tag size={14} color="#6366f1" /> Nhãn AI tự động đề xuất (Tags)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {formData.ai_tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '16px',
                    background: '#ede9fe',
                    color: '#6d28d9',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  <Tag size={11} />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#6d28d9',
                      padding: '0 2px',
                      fontSize: '13px',
                      fontWeight: 800
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Gõ tag mới rồi bấm Enter hoặc dấu phẩy..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Mô tả tóm tắt */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Mô tả tóm tắt sách
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Modal Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="btn btn-outline"
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 24px',
                borderRadius: '10px',
                background: (isSubmitting || isLoading) ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: (isSubmitting || isLoading) ? 'not-allowed' : 'pointer',
                boxShadow: (isSubmitting || isLoading) ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isLoading ? 'Đang xử lý AI...' : 'Đang lưu vào kho sách...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Xác nhận & Lưu vào kho sách</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

