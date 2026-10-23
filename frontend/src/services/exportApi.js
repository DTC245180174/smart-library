// SmartLib File Generation & Export Helpers
import QRCode from 'qrcode';

function getStoredDb() {
  const raw = localStorage.getItem('smartlib_db') || localStorage.getItem('smartlib_db_v6');
  try {
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

export const exportApi = {
  downloadBooksExcel: () => {
    if (window.location.hostname.includes('github.io')) {
      try {
        const db = getStoredDb();
        const books = db.books || [];
        let csv = '\ufeffMã Sách,Tiêu Đề,Tác Giả,Thể Loại,Tổng Số Lượng,Đang Mượn,Khả Dụng\n';
        books.forEach(b => {
          const qty = Number(b.quantity) || 1;
          const borrowed = Number(b.borrowed) || 0;
          const avail = Math.max(0, qty - borrowed);
          csv += `"${b.id}","${b.title}","${b.author || ''}","${b.category || ''}","${qty}","${borrowed}","${avail}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Kho_Sach_SmartLib.csv';
        a.click();
        URL.revokeObjectURL(url);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    window.open('/api/export/books/excel', '_blank');
  },

  downloadBorrowsExcel: () => {
    if (window.location.hostname.includes('github.io')) {
      try {
        const db = getStoredDb();
        const borrows = db.borrow_records || db.borrowRecords || [];
        let csv = '\ufeffMã Phiếu,Tên Sách,Độc Giả,Ngày Mượn,Hạn Trả,Hình Thức,Tiền Phạt (VNĐ),Trạng Thái\n';
        borrows.forEach(r => {
          const fine = Number(r.fineAmount || r.fine_amount || 0);
          csv += `"${r.id}","${r.bookTitle || ''}","${r.readerName || ''}","${r.borrowDate || ''}","${r.returnDate || r.dueDate || ''}","${r.borrowType || ''}","${fine}","${r.status || ''}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Lich_Su_Muon_Tra_SmartLib.csv';
        a.click();
        URL.revokeObjectURL(url);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    window.open('/api/export/borrows/excel', '_blank');
  },

  downloadReadersCsv: () => {
    if (window.location.hostname.includes('github.io')) {
      try {
        const db = getStoredDb();
        const readers = (db.users || []).filter(u => u.role === 'Reader' || !u.role) || db.readers || [];
        let csv = '\ufeffID,Họ và tên,Tên đăng nhập,Email,Số điện thoại,Địa chỉ\n';
        readers.forEach(r => {
          csv += `"${r.id}","${r.fullName || r.name || ''}","${r.username || ''}","${r.email || ''}","${r.phone || ''}","${r.address || ''}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Danh_Sach_Doc_Gia_SmartLib.csv';
        a.click();
        URL.revokeObjectURL(url);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    window.open('/api/export/readers/csv', '_blank');
  },

  downloadBorrowReceiptPdf: (recordId) => {
    if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:') {
      try {
        const db = getStoredDb();
        const borrows = db.borrow_records || db.borrowRecords || [];
        const rec = borrows.find(r => Number(r.id) === Number(recordId));
        if (rec) {
          const printWindow = window.open('', '_blank', 'width=700,height=800');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Phiếu Mượn Sách #${rec.id} - SmartLib</title>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                  .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                  .title { font-size: 24px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin: 0; }
                  .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
                  .receipt-box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #f8fafc; margin-bottom: 30px; }
                  .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
                  .label { font-weight: 600; color: #475569; }
                  .value { font-weight: 700; color: #0f172a; }
                  .status { color: #16a34a; font-weight: 800; }
                  .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 20px; }
                  @media print { .no-print { display: none; } }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="title">Thư Viện Thông Minh SmartLib</div>
                  <div class="subtitle">PHIẾU XÁC NHẬN MƯỢN SÁCH ĐIỆN TỬ</div>
                </div>
                <div class="receipt-box">
                  <div class="row"><span class="label">Mã phiếu mượn:</span><span class="value">#${rec.id}</span></div>
                  <div class="row"><span class="label">Tên sách:</span><span class="value">${rec.bookTitle || 'Sách'}</span></div>
                  <div class="row"><span class="label">Người mượn:</span><span class="value">${rec.readerName || 'Độc giả'}</span></div>
                  <div class="row"><span class="label">Hình thức:</span><span class="value">${rec.borrowType || 'Mượn về nhà'}</span></div>
                  <div class="row"><span class="label">Ngày mượn:</span><span class="value">${(rec.borrowDate || '').substring(0, 10)}</span></div>
                  <div class="row"><span class="label">Hạn trả sách:</span><span class="value" style="color: #dc2626;">${(rec.returnDate || rec.dueDate || '').substring(0, 10)}</span></div>
                  <div class="row"><span class="label">Trạng thái:</span><span class="value status">${rec.status || 'Đang mượn'}</span></div>
                </div>
                <p style="font-size: 13px; color: #64748b; text-align: center;">
                  * Độc giả vui lòng bảo quản sách cẩn thận và hoàn trả đúng hạn. Trả trễ hạn sẽ áp dụng phí phạt theo quy chế thư viện.
                </p>
                <div class="footer">
                  Hệ thống Quản lý Thư viện Thông minh SmartLib &copy; 2026
                </div>
                <script>
                  window.onload = function() { window.print(); }
                </script>
              </body>
              </html>
            `);
            printWindow.document.close();
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    window.open('/api/export/receipt/' + recordId + '/pdf', '_blank');
  },

  downloadBackupJson: () => {
    if (window.location.hostname.includes('github.io')) {
      const raw = localStorage.getItem('smartlib_db') || localStorage.getItem('smartlib_db_v6');
      if (raw) {
        const blob = new Blob([raw], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SmartLib_Database_Backup.json';
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
    }
    window.open('/api/export/backup/json', '_blank');
  },

  getBookQrUrl: (bookId) => {
    return `/api/export/qr/book/${bookId}`;
  },

  getBookQrDataUrl: async (book) => {
    const text = `SMARTLIB-BOOK-ID:${book.id}|${book.title}|Tác giả:${book.author || 'Chưa rõ'}|Thể loại:${book.category || 'Khác'}`;
    return await QRCode.toDataURL(text, {
      width: 220,
      margin: 1,
      color: { dark: '#1e40af', light: '#ffffff' }
    });
  }
};