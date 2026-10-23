import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { Bell, CheckCircle, XCircle, X, BookOpen } from 'lucide-react';

const NotificationContext = createContext();

let lastSoundTime = 0;
const playNotificationSound = () => {
  const now = Date.now();
  if (now - lastSoundTime < 1500) return;
  lastSoundTime = now;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    
    // Note 1 (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, t);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.22);

    // Note 2 (B5 - 987.77Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, t + 0.1);
    gain2.gain.setValueAtTime(0.15, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.4);
  } catch (e) {
    // Audio might be blocked if user hasn't clicked page yet, safe to ignore
  }
};

export const NotificationProvider = ({ children }) => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveToast, setLiveToast] = useState(null);

  // Set lưu danh sách ID thông báo đã thấy để không bao giờ thông báo lặp lại
  const seenNotifIdsRef = useRef(new Set());
  const isInitializedRef = useRef(false);

  // Khi thay đổi vai trò hoặc tài khoản (Admin <-> Reader), reset lại bộ nhớ thông báo một cách an toàn
  useEffect(() => {
    isInitializedRef.current = false;
    seenNotifIdsRef.current = new Set();
    setLiveToast(null);
  }, [user?.id, role]);

  const fetchNotifications = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const res = await api.getNotifications(role, user.id);
      if (res && res.notifications) {
        const rawNotifs = res.notifications || [];
        const normalizedCount = Number(res.unreadCount || 0);

        // 1. Lần đầu tải ứng dụng: Ghi nhận tất cả ID thông báo hiện có để không báo lại các thông báo cũ
        if (!isInitializedRef.current) {
          rawNotifs.forEach(n => {
            if (n && n.id != null) {
              seenNotifIdsRef.current.add(Number(n.id));
            }
          });
          isInitializedRef.current = true;
          setNotifications(rawNotifs);
          setUnreadCount(normalizedCount);
          return;
        }

        // 2. Các lần cập nhật sau: Tìm chính xác thông báo MỚI CHƯA TỪNG THẤY và chưa đọc
        const brandNewNotifs = rawNotifs.filter(
          n => n && n.id != null && !seenNotifIdsRef.current.has(Number(n.id)) && !n.isRead
        );

        // Thu thập các mã phiếu mượn đã hoàn tất trả sách
        const returnedRecordIds = new Set(
          rawNotifs
            .filter(n => n.type === 'book_returned')
            .map(n => Number(n.recordId || n.meta?.recordId))
            .filter(Boolean)
        );

        // Lọc bỏ thông báo duyệt mượn hoặc yêu cầu mượn của các cuốn sách ĐÃ HOÀN TẤT TRẢ
        // (Khắc phục triệt để lỗi vừa bấm trả sách lại bị nhảy thông báo mượn sách thành công)
        const validNewNotifs = brandNewNotifs.filter(n => {
          if (n.type === 'borrow_approved' || n.type === 'borrow_request') {
            const recId = Number(n.recordId || n.meta?.recordId);
            if (recId && returnedRecordIds.has(recId)) {
              return false;
            }
          }
          return true;
        });

        if (validNewNotifs.length > 0) {
          const newest = validNewNotifs[0];
          playNotificationSound();
          setLiveToast(newest);
        }

        // Đánh dấu tất cả thông báo hiện có vào Set đã thấy
        rawNotifs.forEach(n => {
          if (n && n.id != null) {
            seenNotifIdsRef.current.add(Number(n.id));
          }
        });

        // Chỉ cập nhật state khi thực sự có thay đổi (shallow comparison) để ngăn chặn giật / nhấp nháy UI
        setNotifications(prev => {
          if (
            prev.length === rawNotifs.length &&
            prev.every((p, idx) => Number(p.id) === Number(rawNotifs[idx]?.id) && p.isRead === rawNotifs[idx]?.isRead && p.title === rawNotifs[idx]?.title)
          ) {
            return prev; // Giữ nguyên reference, không kích hoạt re-render!
          }
          return rawNotifs;
        });

        setUnreadCount(prev => prev === normalizedCount ? prev : normalizedCount);
      }
    } catch (e) {
      console.error('Lỗi khi tải thông báo:', e);
    }
  }, [user?.id, role]);

  // Lắng nghe sự kiện đồng bộ tức thì qua custom event, storage event và BroadcastChannel
  useEffect(() => {
    fetchNotifications();

    let debounceTimer = null;
    const debouncedFetch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchNotifications();
      }, 150);
    };

    const handleCustomEvent = () => {
      debouncedFetch();
    };

    const handleStorageUpdate = (e) => {
      // Chỉ kích hoạt tải thông báo khi đúng sự kiện dữ liệu thư viện hoặc thông báo, bỏ qua currentUser giữa 2 tab
      if (e.key === 'smartlib_last_update' || e.key === 'smartlib_db' || e.key === 'smartlib_notif_update') {
        debouncedFetch();
      }
    };

    window.addEventListener('smartlib:data-updated', handleCustomEvent);
    window.addEventListener('storage', handleStorageUpdate);
    
    // Polling ngầm định kỳ 5s
    const interval = setInterval(fetchNotifications, 5000);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('smartlib:data-updated', handleCustomEvent);
      window.removeEventListener('storage', handleStorageUpdate);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  // Tự động ẩn Toast thông báo thời gian thực sau 5 giây
  useEffect(() => {
    if (liveToast) {
      const timer = setTimeout(() => {
        setLiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [liveToast]);

  const markAsRead = async (notifId) => {
    // Cập nhật giao diện tức thì (0ms latency)
    setNotifications(prev => prev.map(n => Number(n.id) === Number(notifId) ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.readNotification(notifId);
    } catch (e) {
      console.error('Lỗi markAsRead:', e);
    }
  };

  const markAllAsRead = async () => {
    // Cập nhật giao diện tức thì (0ms latency)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await api.readAllNotifications(role, user ? user.id : null);
    } catch (e) {
      console.error('Lỗi markAllAsRead:', e);
    }
  };

  const deleteNotification = async (notifId) => {
    setNotifications(prev => prev.filter(n => Number(n.id) !== Number(notifId)));
    try {
      await api.deleteNotification(notifId);
    } catch (e) {
      console.error('Lỗi deleteNotification:', e);
    }
  };

  const clearReadNotifications = async () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
    try {
      await api.clearReadNotifications(role, user ? user.id : null);
    } catch (e) {
      console.error('Lỗi clearReadNotifications:', e);
    }
  };

  const getToastBorderColor = (type) => {
    if (type === 'borrow_approved' || type === 'book_returned') return '#10b981';
    if (type === 'borrow_rejected') return '#ef4444';
    return '#3b82f6';
  };

  const getToastIconBg = (type) => {
    if (type === 'borrow_approved' || type === 'book_returned') return '#064e3b';
    if (type === 'borrow_rejected') return '#7f1d1d';
    return '#1e3a8a';
  };

  const getToastIconColor = (type) => {
    if (type === 'borrow_approved' || type === 'book_returned') return '#34d399';
    if (type === 'borrow_rejected') return '#f87171';
    return '#60a5fa';
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearReadNotifications }}>
      {children}

      {/* Floating Real-time Notification Banner */}
      {liveToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 999999,
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            maxWidth: '420px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderLeft: `5px solid ${getToastBorderColor(liveToast.type)}`,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: getToastIconBg(liveToast.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: getToastIconColor(liveToast.type)
            }}
          >
            {liveToast.type === 'borrow_approved' || liveToast.type === 'book_returned' ? <CheckCircle size={20} /> :
             liveToast.type === 'borrow_rejected' ? <XCircle size={20} /> :
             liveToast.type === 'borrow_request' ? <BookOpen size={20} /> :
             <Bell size={20} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              {liveToast.title || 'Thông báo mới'}
            </div>
            <div style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.45' }}>
              {liveToast.message}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
              Vừa nhận được • Tức thì
            </div>
          </div>
          <button
            onClick={() => setLiveToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Đóng thông báo"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);