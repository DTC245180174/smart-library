import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Công nghệ thông tin',
  'Kỹ năng sống & Phát triển bản thân',
  'Tâm lý & Xã hội',
  'Lịch sử & Triết học',
  'Kinh tế & Quản trị',
  'Văn học & Nghệ thuật',
  'Khoa học & Đời sống',
  'Khác'
];

export default function AddEditBookModal({ isOpen, onClose, onSave, book }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Công nghệ thông tin',
    quantity: 1,
    desc: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        category: book.category || 'Công nghệ thông tin',
        quantity: book.quantity || 1,
        desc: book.desc || '',
        imageUrl: book.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Công nghệ thông tin',
        quantity: 1,
        desc: '',
        imageUrl: ''
      });
    }
    setError('');
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tên sách.');
      return;
    }
    if (Number(formData.quantity) < 1) {
      setError('Số lượng phải lớn hơn hoặc bằng 1.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{book ? 'Chỉnh sửa thông tin sách' : 'Thêm sách mới vào thư viện'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Tên sách *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Clean Code, Đắc Nhân Tâm..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tác giả</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Robert C. Martin"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Thể loại</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Số lượng trong kho *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="form-group">
                <label>Ảnh bìa (Tải lên hoặc dán URL)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="URL ảnh (http://...)"
                    value={formData.imageUrl && !formData.imageUrl.startsWith('data:') ? formData.imageUrl : ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-outline" style={{ padding: '8px 12px', cursor: 'pointer', margin: 0, whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    <span>Tải ảnh</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Mô tả sách</label>
                <textarea
                  rows="3"
                  placeholder="Nhập nội dung tóm tắt hoặc giới thiệu cuốn sách..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">Hủy</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang lưu...' : (book ? 'Lưu thay đổi' : 'Thêm sách')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}