import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Terminal, AlertCircle, 
  CheckCircle2, Copy, Check, X, RefreshCw, Table as TableIcon,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_PROMPTS = [
  'Liệt kê sách mượn quá hạn',
  'Top 5 sách mượn nhiều nhất',
  'Những sách nào còn sẵn trong kho',
  'Danh sách độc giả bị khóa tài khoản',
  'Các yêu cầu gia hạn đang chờ duyệt',
  'Khoản tiền phạt chưa nộp'
];

export default function AdminChatbot({ onClose }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  const [history, setHistory] = useState([
    {
      role: 'assistant',
      text: 'Xin chào Quản trị viên! Tôi là Trợ lý AI Text-to-SQL. Bạn có thể hỏi bất kỳ câu hỏi nào bằng tiếng Việt về kho sách, mượn trả, độc giả hay tiền phạt.',
      sql: null,
      data: null,
      columns: [],
      error: null
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSend = async (queryToSend) => {
    const q = (queryToSend || inputText).trim();
    if (!q || loading || isLoading) return;

    const userMsg = { role: 'user', text: q };
    setHistory(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.adminQueryAI(q);
      const botMsg = {
        role: 'assistant',
        text: res.explanation || (res.success ? 'Đã truy vấn dữ liệu thành công từ cơ sở dữ liệu.' : 'Không thể thực thi câu truy vấn.'),
        sql: res.sql,
        columns: res.columns || [],
        data: res.data || [],
        total_rows: res.total_rows || 0,
        error: res.error || null,
        success: res.success
      };
      setHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Lỗi khi kết nối với AI Chatbot hoặc quá thời gian chờ (timeout). Vui lòng thử lại!';
      setErrorMessage(errMsg);
      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Rất tiếc, đã xảy ra lỗi trong quá trình xử lý câu truy vấn.',
          error: errMsg,
          success: false
        }
      ]);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /*
     * Container chính: flex flex-col với chiều cao cố định.
     * Bố cục 3 phần rõ rệt: Header (shrink-0), Body (flex-1 min-h-0 — KEY FIX), Footer (shrink-0).
     * "min-h-0" là bắt buộc để Body thực sự cuộn được trong flex container.
     */
    <div className="flex flex-col w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-gray-800">

      {/* ── HEADER (cố định, shrink-0) ────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              Trợ lý Truy vấn Thông minh (Text-to-SQL)
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold uppercase">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Hỏi đáp trực tiếp với cơ sở dữ liệu MySQL bằng Tiếng Việt tự nhiên
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── BODY (cuộn được) ──────────────────────────────────── */}
      {/*
       * [KEY FIX] flex-1 min-h-0:
       *   - flex-1  → chiếm toàn bộ không gian còn lại theo chiều dọc
       *   - min-h-0 → ghi đè min-height: auto mặc định của flex item,
       *               cho phép overflow-y-auto hoạt động đúng
       */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-50/60">

        {/* Banner lỗi kết nối */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button type="button" onClick={() => setErrorMessage('')} className="text-rose-400 hover:text-rose-700 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Danh sách tin nhắn */}
        {history.map((msg, index) => {
          if (msg.role === 'user') {
            return (
              /* Bong bóng User: bên phải, nền xanh */
              <div key={index} className="flex justify-end">
                {/* [TINH CHỈNH] p-4 để chữ không dính sát lề */}
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-4 max-w-[80%] shadow-sm text-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            /* Bong bóng AI: bên trái, nền xám nhạt */
            <div key={index} className="flex justify-start">
              {/* [TINH CHỈNH] p-4 để chữ không dính sát lề */}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 max-w-[85%] shadow-sm space-y-0">

                {/* Text giải thích */}
                <div className="text-sm text-gray-800 leading-relaxed">
                  {msg.text}
                </div>

                {/* Banner lỗi trong tin nhắn */}
                {msg.error && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{msg.error}</span>
                  </div>
                )}

                {/* 4. [TINH CHỈNH] Khối code SQL: mt-3 mb-3 tạo margin; pre có overflow-x-auto p-3 rounded-md */}
                {msg.sql && (
                  <div className="mt-3 mb-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono">
                    {/* Thanh tiêu đề SQL */}
                    <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-700/80">
                      <span className="flex items-center gap-1.5 font-semibold text-indigo-300 text-[11px]">
                        <Terminal className="w-3.5 h-3.5" /> SQL Query Generated
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.sql)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                    {/* [TINH CHỈNH] pre + code: overflow-x-auto p-3 rounded-md */}
                    <pre className="overflow-x-auto p-3 rounded-b-xl bg-slate-950/60 text-emerald-400 font-semibold leading-relaxed m-0">
                      <code>{msg.sql}</code>
                    </pre>
                  </div>
                )}

                {/* 3. [TINH CHỈNH] Bảng kết quả: bọc bằng overflow-x-auto border border-gray-200 rounded-lg mt-3 */}
                {msg.data && msg.data.length > 0 && (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg mt-3 bg-white">
                    {/* Sub-header bảng */}
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                      <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                      Kết quả truy vấn ({msg.total_rows} bản ghi)
                    </div>
                    {/* Vùng cuộn bảng */}
                    <div className="max-h-56 overflow-auto">
                      <table className="min-w-full text-left">
                        {/* [TINH CHỈNH] thead/th: bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-2 text-left border-b */}
                        <thead>
                          <tr>
                            {(msg.columns && msg.columns.length > 0
                              ? msg.columns
                              : Object.keys(msg.data[0] || {})
                            ).map((col, idx) => (
                              <th
                                key={idx}
                                className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-2 text-left border-b border-gray-200 whitespace-nowrap sticky top-0"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        {/* [TINH CHỈNH] tbody/td: px-4 py-2 text-sm text-gray-800 border-b */}
                        <tbody>
                          {msg.data.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                              {(msg.columns && msg.columns.length > 0
                                ? msg.columns.map(col => row[col])
                                : Object.values(row)
                              ).map((val, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="px-4 py-2 text-sm text-gray-800 border-b border-gray-100 whitespace-nowrap"
                                >
                                  {val !== null && val !== undefined ? String(val) : '–'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Kết quả rỗng */}
                {msg.data && msg.data.length === 0 && !msg.error && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Truy vấn hợp lệ nhưng không tìm thấy bản ghi nào khớp điều kiện.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              <span className="text-xs font-semibold text-gray-600">
                AI đang phân tích câu hỏi và sinh truy vấn MySQL...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── FOOTER (cố định, shrink-0) ────────────────────────── */}
      {/*
       * [TINH CHỈNH] Footer: bg-white border-t border-gray-200 p-4 z-10
       *   - z-10 đảm bảo Footer luôn nằm trên Body khi cuộn
       *   - shrink-0 ngăn Footer bị nén khi Body dài
       */}
      <div className="shrink-0 bg-white border-t border-gray-200 p-4 z-10">

        {/* 1. [TINH CHỈNH] Khu vực "Gợi ý nhanh":
               - Đặt trực tiếp trong Footer, TRÊN ô input
               - flex overflow-x-auto gap-2 pb-3 mb-2 hide-scrollbar */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-2 hide-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            /*
             * [TINH CHỈNH] MỖI gợi ý là một thẻ button riêng biệt với:
             *   whitespace-nowrap px-3 py-1.5 bg-white border border-gray-300
             *   rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600
             *   transition-colors shadow-sm
             */
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={loading || isLoading}
              className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Ô nhập câu hỏi + Nút Gửi */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi AI bằng Tiếng Việt (VD: Liệt kê sách mượn quá hạn...)"
              disabled={loading || isLoading}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            />
            <Sparkles className="w-4 h-4 text-blue-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || loading || isLoading}
            className="h-[42px] px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap cursor-pointer"
          >
            {isLoading || loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>Gửi</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Dòng footer nhỏ thông tin bảo mật */}
        <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between px-1">
          <span>🔒 Chế độ bảo mật: Tự động khóa toàn bộ lệnh ghi (INSERT / UPDATE / DELETE / DROP)</span>
          <span>⚡ MySQL &amp; SQLite Mirror</span>
        </div>
      </div>
    </div>
  );
}
