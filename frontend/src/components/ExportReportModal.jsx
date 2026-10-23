import React from 'react';
import { X, FileSpreadsheet, FileText, Database, QrCode, Download, CheckCircle2 } from 'lucide-react';
import { exportApi } from '../services/exportApi';

export default function ExportReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet className="text-blue-600" size={20} />
            <span>Trung tâm Xuất dữ liệu & Sinh file</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
            Tất cả các định dạng file dưới đây được xử lý và sinh tự động bởi hệ thống SmartLib (Excel, PDF, QRCode).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Sách Excel */}
            <div
              onClick={exportApi.downloadBooksExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Xuất Danh Sách Kho Sách (.xlsx)</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Bảng tính Excel định dạng chuẩn, số lượng, tồn kho, phân loại</p>
                </div>
              </div>
              <Download size={18} style={{ color: '#2563eb' }} />
            </div>

            {/* Mượn trả Excel */}
            <div
              onClick={exportApi.downloadBorrowsExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Xuất Lịch Sử Mượn Trả (.xlsx)</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Tổng hợp toàn bộ lượt mượn, hạn trả và tình trạng quá hạn</p>
                </div>
              </div>
              <Download size={18} style={{ color: '#2563eb' }} />
            </div>

            {/* Độc giả CSV */}
            <div
              onClick={exportApi.downloadReadersCsv}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Xuất Danh Sách Độc Giả (.csv)</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Hồ sơ độc giả định dạng UTF-8 BOM hiển thị chuẩn Tiếng Việt</p>
                </div>
              </div>
              <Download size={18} style={{ color: '#2563eb' }} />
            </div>

            {/* Database Backup JSON */}
            <div
              onClick={exportApi.downloadBackupJson}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
                  <Database size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Sao Lưu Cơ Sở Dữ Liệu (.json)</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Trích xuất toàn bộ dữ liệu sách, độc giả và lịch sử mượn</p>
                </div>
              </div>
              <Download size={18} style={{ color: '#2563eb' }} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">Đóng</button>
        </div>
      </div>
    </div>
  );
}