import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, 
  Lock, X, ExternalLink, Clock, UserX, BookX, Zap, Check, Eye
} from 'lucide-react';
import { api } from '../services/api';

export default function AlertQueue({ onClose, onLockReader }) {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const data = await api.getFlaggedAnomalies();
      setAnomalies(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bất thường:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const handleScanNow = async () => {
    setScanning(true);
    try {
      await api.triggerAnomalyScan();
      await fetchAnomalies();
      setActionSuccess('Đã hoàn tất quét toàn bộ giao dịch!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleResolve = async (recordId) => {
    try {
      await api.resolveAnomaly(recordId);
      setAnomalies(prev => prev.filter(a => a.id !== recordId));
      setActionSuccess(`Đã gỡ cờ cảnh báo cho phiếu #${recordId}`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateTestData = async () => {
    setScanning(true);
    try {
      await api.simulateTestAnomalies();
      await fetchAnomalies();
      setActionSuccess('Đã tạo 6 giao dịch bất thường mẫu!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[650px] max-h-[85vh] w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-gray-800">
      
      {/* 1. Header của Modal:
          Bỏ nền đỏ chót đi. Chuyển sang nền trắng thông thường bg-white border-b, tiêu đề chữ dùng màu text-red-600 font-bold text-xl */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2.5">
              Hàng đợi Cảnh báo Bất thường (AI Anomaly Queue)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                {anomalies.length} vi phạm
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Phát hiện mượn - trả dưới 15 phút hoặc độc giả báo mất liên tục 5 cuốn sách
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toolbar điều khiển */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleScanNow}
            disabled={scanning || loading}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin text-red-600' : ''}`} />
            <span>Quét AI ngay</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateTestData}
            disabled={scanning || loading}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-medium flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tạo dữ liệu vi phạm mẫu</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="text-gray-500 font-medium">
          Chu kỳ nền: <span className="font-semibold text-gray-700">Tự động quét mỗi 60s</span>
        </div>
      </div>

      {/* Body List */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50/60">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-sm font-semibold">Đang kiểm tra dữ liệu mượn trả...</span>
          </div>
        ) : anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h4 className="font-bold text-gray-800 text-base mb-1">
              Hệ thống an toàn! Không có giao dịch bất thường nào
            </h4>
            <p className="text-xs text-gray-500 max-w-md mb-4">
              Không phát hiện phiếu mượn - trả siêu tốc dưới 15 phút hoặc tài khoản báo mất liên tiếp.
            </p>
            <button
              type="button"
              onClick={handleSimulateTestData}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Thử nghiệm tạo vi phạm mẫu
            </button>
          </div>
        ) : (
          anomalies.map((item) => {
            return (
              /* 2. Thiết kế thẻ vi phạm (Violation Cards):
                 Mỗi vi phạm là một Card riêng biệt. Bọc bằng bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4 */
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4"
              >
                {/* Hàng 1 (Header của thẻ): Dùng flex justify-between items-center mb-3.
                    Bên trái là Badge điểm Score (bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-sm).
                    Bên phải là cụm nút hành động (Gỡ cờ, Khóa) dùng style nút bấm rõ ràng border rounded-lg px-3 py-1.5 text-sm */}
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  {/* Bên trái: Badge điểm Score & ID */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs text-gray-400 font-semibold">
                      #{item.id}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Score: {item.anomaly_score} {item.anomaly_score >= 0.95 ? '• NGUY HIỂM' : '• CẢNH BÁO'}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      Trạng thái: <strong className="text-gray-700 font-semibold">{item.status}</strong>
                    </span>
                  </div>

                  {/* Bên phải: Cụm nút hành động */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleResolve(item.id)}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Đánh dấu đã kiểm tra an toàn và gỡ cờ"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Gỡ cờ</span>
                    </button>

                    {onLockReader && (
                      <button
                        type="button"
                        onClick={() => onLockReader(item.user_id, item.anomaly_reason)}
                        className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Khóa tài khoản độc giả này để ngăn chặn thất thoát"
                      >
                        <Lock className="w-4 h-4 text-red-600" />
                        <span>Khóa độc giả</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Phân cấp thông tin (Hierarchy) bên trong thẻ:
                    Không dàn hàng ngang lộn xộn. Chia làm Grid 2 cột: grid grid-cols-2 gap-4 mb-3.
                    Quy tắc Typography: Nhãn (Label) text-xs text-gray-500 uppercase, Giá trị (Value) text-sm font-medium text-gray-900 */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Đầu sách</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">
                      {item.book_title} <span className="text-xs text-gray-400 font-normal">(ID: {item.book_id})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Độc giả</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">
                      {item.reader_name} <span className="text-xs text-gray-400 font-normal">(ID: {item.user_id})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Ngày mượn</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">
                      {(item.borrow_date || '').replace('T', ' ').substring(0, 19)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Trả thực tế</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">
                      {item.actual_return_date ? item.actual_return_date.replace('T', ' ').substring(0, 19) : 'Chưa trả'}
                    </div>
                  </div>
                </div>

                {/* 4. Thông báo lỗi cụ thể (Dòng Bất thường thời gian):
                    Tách biệt hẳn ra ở dưới cùng của thẻ. Đặt trong một khung cảnh báo nhẹ: 
                    bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 rounded-r */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 rounded-r flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" />
                  <span>{item.anomaly_reason}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-white border-t border-gray-200 text-[11.5px] text-gray-500 flex items-center justify-between px-6 shrink-0">
        <span>🔍 Thuật toán: Rule-based Window Timing & Consecutive Loss Frequency Filtering</span>
        <span>⚡ Cập nhật cột is_flagged & anomaly_score trực tiếp vào CSDL</span>
      </div>
    </div>
  );
}
