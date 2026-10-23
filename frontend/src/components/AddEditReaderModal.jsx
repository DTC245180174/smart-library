import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddEditReaderModal({ isOpen, onClose, onSave, reader }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '123',
    phone: '',
    email: '',
    address: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reader) {
      setFormData({
        fullName: reader.fullName || '',
        username: reader.username || '',
        password: '',
        phone: reader.phone || '',
        email: reader.email || '',
        address: reader.address || '',
        birthDate: reader.birthDate || ''
      });
    } else {
      setFormData({
        fullName: '',
        username: '',
        password: '123',
        phone: '',
        email: '',
        address: '',
        birthDate: ''
      });
    }
    setError('');
  }, [reader, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên độc giả.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thông tin độc giả');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{reader ? 'Chỉnh sửa thông tin độc giả' : 'Thêm độc giả mới'}</span>
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
                <label>Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {!reader && (
                <>
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                      type="text"
                      placeholder="Mặc định: tự sinh"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu khởi tạo</label>
                    <input
                      type="text"
                      placeholder="Mặc định: 123"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Hà Nội, TP.HCM..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">Hủy</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang lưu...' : (reader ? 'Lưu thay đổi' : 'Thêm độc giả')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}