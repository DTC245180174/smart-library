import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, CheckCircle, ShieldCheck, QrCode, CreditCard,
  Clock, AlertTriangle, Copy, Check, RefreshCw,
  Smartphone, Wifi
} from 'lucide-react';
import { api } from '../services/api';

export default function VNPayPaymentModal({ isOpen, onClose, reader, fine, amount, onPaymentSuccess, onSuccess }) {
  const [activeTab, setActiveTab] = useState('qr');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [countdown, setCountdown] = useState(900);
  const [kickCountdown, setKickCountdown] = useState(4);
  const [copiedField, setCopiedField] = useState('');
  const [pollingActive, setPollingActive] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const pollingRef = useRef(null);

  const payAmount = Number(amount || fine?.fineAmount || 10000);
  const readerId = reader?.id || fine?.readerId || 2;
  const readerName = reader?.fullName || fine?.readerName || 'Doc gia';

  useEffect(() => {
    if (!isOpen) return;
    setPaymentSuccess(false);
    setSuccessInfo(null);
    setCountdown(900);
    setKickCountdown(4);
    setPollingActive(false);
    setLoading(true);

    const orderInfo = `SMARTLIB NOP PHAT DG-${String(readerId).padStart(3, '0')}`;
    api.createVNPayPayment({
      fineId: fine?.id,
      readerId,
      amount: payAmount,
      orderInfo
    }).then(res => {
      setPaymentData(res);
      if (res?.timeoutMinutes) {
        setCountdown(res.timeoutMinutes * 60);
      }
      setPollingActive(true);
    }).catch(async () => {
      let sett = {};
      try {
        if (api.getSettings) sett = await api.getSettings();
      } catch (e) {}
      const txnRef = `VNP${Date.now()}_${readerId}`;
      const accNum = sett.vnpayAccountNumber || '0987654321';
      const accName = sett.vnpayAccountName || 'THU VIEN SMARTLIB';
      const bBin = sett.vnpayBankBin || '970422';
      const bName = sett.vnpayBankName || 'Ngân hàng TMCP Quân Đội (MBBank)';
      const tMins = sett.vnpayTimeoutMinutes || 15;
      setCountdown(tMins * 60);
      setPaymentData({
        txnRef,
        amount: payAmount,
        orderInfo,
        bankName: bName,
        accountNumber: accNum,
        accountName: accName,
        qrCodeUrl: `https://api.vietqr.io/image/${bBin}-${accNum}-compact2.jpg?amount=${payAmount}&addInfo=${encodeURIComponent(orderInfo)}&accountName=${encodeURIComponent(accName)}`
      });
      setPollingActive(true);
    }).finally(() => setLoading(false));
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen || countdown <= 0 || paymentSuccess) return;
    const timer = setInterval(() => setCountdown(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown, paymentSuccess]);

  // Đếm ngược tự động kick / đăng xuất sau khi gửi yêu cầu nộp phạt thành công
  useEffect(() => {
    if (!paymentSuccess) return;
    setKickCountdown(4);
    const timer = setInterval(() => {
      setKickCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onPaymentSuccess && successInfo) onPaymentSuccess(successInfo);
          if (onSuccess && successInfo) onSuccess(successInfo);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentSuccess, successInfo]);

  useEffect(() => {
    if (!pollingActive || paymentSuccess || !paymentData?.txnRef) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${paymentData.txnRef}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'PAID' || data.status === 'WAITING_APPROVAL' || data.status === 'APPROVED') {
            clearInterval(pollingRef.current);
            setPollingActive(false);
            setPaymentSuccess(true);
            setSuccessInfo(data);
          }
        }
      } catch (e) {}
    }, 12000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [pollingActive, paymentData?.txnRef, paymentSuccess]);

  useEffect(() => {
    if (!isOpen) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      setPollingActive(false);
    }
  }, [isOpen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2200);
  };

  const handleConfirmPayment = async () => {
    setConfirmLoading(true);
    try {
      const res = await api.verifyVNPayPayment({
        fineId: fine?.id || paymentData?.fineId,
        readerId,
        transactionRef: paymentData?.txnRef || `VNP${Date.now()}_${readerId}`,
        amount: payAmount,
        status: 'SUCCESS'
      });
      setPaymentSuccess(true);
      setSuccessInfo(res);
      setPollingActive(false);
      if (pollingRef.current) clearInterval(pollingRef.current);
    } catch (e) {
      alert('Lỗi xác nhận thanh toán: ' + (e.message || 'Vui lòng thử lại.'));
    } finally {
      setConfirmLoading(false);
    }
  };

  if (!isOpen) return null;

  const CopyBtn = ({ text, field, label }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      title={`Sao chep ${label}`}
      style={{
        background: copiedField === field ? '#dcfce7' : '#eff6ff',
        border: `1px solid ${copiedField === field ? '#86efac' : '#bfdbfe'}`,
        borderRadius: '6px', padding: '3px 8px', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', color: copiedField === field ? '#15803d' : '#1d4ed8',
        fontWeight: 700, transition: 'all 0.2s', flexShrink: 0, whiteSpace: 'nowrap'
      }}
    >
      {copiedField === field ? <Check size={11} /> : <Copy size={11} />}
      {copiedField === field ? 'Da copy' : 'Copy'}
    </button>
  );

  const modalContent = (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh', boxSizing: 'border-box',
        backgroundColor: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(6px)',
        zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '530px',
          maxHeight: '92vh', overflowY: 'auto', margin: 'auto',
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.35)',
          display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #005baa 0%, #003e7e 100%)',
          color: '#fff', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '18px 18px 0 0', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#fff', padding: '4px 10px', borderRadius: '6px' }}>
              <span style={{ color: '#ed1c24', fontWeight: 900, fontSize: '17px', letterSpacing: '-0.5px' }}>VNPAY</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px' }}>Cổng Thanh Toán Trực Tuyến</div>
              <div style={{ fontSize: '11px', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <ShieldCheck size={11} />
                <span>Bảo mật PCI-DSS - Mã hóa SSL 256-bit</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '30px', height: '30px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <X size={16} />
          </button>
        </div>

        {paymentSuccess ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#d97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(217,119,6,0.25)'
            }}>
              <Clock size={42} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Đã Gửi Yêu Cầu Nộp Phạt! ⏳
            </h3>
            <p style={{ color: '#b45309', fontSize: '13.5px', fontWeight: 700, margin: '0 0 16px' }}>
              Giao dịch đã được gửi về trang quản trị và đang chờ Quản trị viên duyệt.
            </p>
            <div style={{
              background: '#fffbeb', border: '1.5px solid #fde68a',
              borderRadius: '12px', padding: '16px', textAlign: 'left',
              fontSize: '13px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
              {[
                { label: 'Mã giao dịch:', value: successInfo?.transactionRef || paymentData?.txnRef || '-' },
                { label: 'Số tiền nộp phạt:', value: `${payAmount.toLocaleString('vi-VN')} đ`, color: '#b45309', size: '15px' },
                { label: 'Độc giả:', value: `${readerName} (DG-${String(readerId).padStart(3, '0')})` },
                { label: 'Trạng thái xử lý:', value: '⏳ Chờ Quản trị viên duyệt', color: '#d97706', weight: 800 },
                { label: 'Lưu ý:', value: 'Tài khoản sẽ được mở lại sau khi Quản trị viên duyệt. Hệ thống sẽ tự động kick độc giả ra ngoài để bảo toàn trạng thái chờ duyệt.', color: '#475569', weight: 600 }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: item.label === 'Lưu ý:' ? 'flex-start' : 'center', gap: '10px' }}>
                  <span style={{ color: '#64748b', flexShrink: 0 }}>{item.label}</span>
                  <strong style={{ color: item.color || '#0f172a', fontSize: item.size || '13px', fontWeight: item.weight || 700, textAlign: item.label === 'Lưu ý:' ? 'right' : 'inherit' }}>
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (onPaymentSuccess && successInfo) onPaymentSuccess(successInfo);
                if (onSuccess && successInfo) onSuccess(successInfo);
                onClose();
              }}
              style={{
                width: '100%', background: 'linear-gradient(135deg,#d97706,#b45309)',
                color: '#fff', border: 'none', padding: '13px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(217,119,6,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <span>Đã hiểu & Đăng xuất ngay ({kickCountdown}s)</span>
            </button>
          </div>
        ) : (
          <div style={{ padding: '18px 20px 20px' }}>
            {/* Summary */}
            <div style={{
              background: 'linear-gradient(135deg,#fef2f2,#fff7f7)',
              border: '1.5px solid #fecaca', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Nop phat qua han thu vien
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {readerName}
                  <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '12px' }}> - DG-{String(readerId).padStart(3, '0')}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>So tien can nop</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#dc2626', lineHeight: 1.1 }}>
                  {payAmount.toLocaleString('vi-VN')}<span style={{ fontSize: '13px', fontWeight: 600 }}> d</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              {[
                { id: 'qr', icon: <QrCode size={15} />, label: 'Quet ma VNPay-QR' },
                { id: 'card', icon: <CreditCard size={15} />, label: 'The ATM / Internet' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '8px 10px', borderRadius: '8px', border: 'none', fontSize: '12.5px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  background: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? '#005baa' : '#64748b',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,91,170,0.12)' : 'none',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}>
                  {tab.icon}<span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* QR TAB */}
            {activeTab === 'qr' && (
              <div>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                  <div style={{
                    background: '#fff', border: '2px solid #005baa', borderRadius: '12px',
                    padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', alignSelf: 'flex-start'
                  }}>
                    {loading ? (
                      <div style={{ width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <RefreshCw size={28} />
                      </div>
                    ) : paymentData?.qrCodeUrl ? (
                      <img src={paymentData.qrCodeUrl} alt="VNPay QR"
                        style={{ width: '140px', height: '140px', objectFit: 'contain', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <QrCode size={40} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '5px', right: '5px', background: '#eff6ff', color: '#1d4ed8', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>VietQR</div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a' }}>Thong tin chuyen khoan</div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '7px 10px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Ngan hang</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{paymentData?.bankName || 'MBBank (Quan Doi)'}</div>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '7px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>So tai khoan</div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#005baa', letterSpacing: '1px' }}>{paymentData?.accountNumber || '0987654321'}</div>
                        </div>
                        <CopyBtn text={paymentData?.accountNumber || '0987654321'} field="account" label="so tai khoan" />
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '7px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>So tien</div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>{payAmount.toLocaleString('vi-VN')} d</div>
                        </div>
                        <CopyBtn text={String(payAmount)} field="amount" label="so tien" />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                  padding: '10px 12px', marginBottom: '12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Noi dung chuyen khoan (bat buoc)</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#dc2626', wordBreak: 'break-all' }}>
                      {paymentData?.orderInfo || `SMARTLIB NOP PHAT DG-${String(readerId).padStart(3, '0')}`}
                    </div>
                  </div>
                  <CopyBtn
                    text={paymentData?.orderInfo || `SMARTLIB NOP PHAT DG-${String(readerId).padStart(3, '0')}`}
                    field="content" label="noi dung" />
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '11.5px', color: '#1e40af', lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Smartphone size={13} />
                    Huong dan thanh toan qua App ngan hang:
                  </div>
                  <div>
                    1. Mo App ngan hang &rarr; <strong>Quet ma QR</strong> hoac <strong>Chuyen tien</strong><br />
                    2. Nhap dung so TK, so tien va noi dung chuyen khoan o tren<br />
                    3. Xac nhan giao dich thanh cong &rarr; Nhan <strong>"Toi da chuyen khoan"</strong> ben duoi
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} color={countdown < 120 ? '#dc2626' : '#ea580c'} />
                    <span style={{ color: countdown < 120 ? '#dc2626' : '#64748b' }}>
                      Het han sau: <strong style={{ color: countdown < 120 ? '#dc2626' : '#ea580c' }}>{formatTime(countdown)}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Wifi size={12} color="#22c55e" />
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                      {pollingActive ? 'Dang theo doi giao dich...' : 'Cho xac nhan'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CARD TAB */}
            {activeTab === 'card' && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} />
                    Thanh toan qua The ATM / Internet Banking
                  </div>
                  <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.7 }}>
                    Su dung the ATM noi dia hoac Internet Banking de thanh toan qua cong VNPay.<br />
                    He thong ho tro <strong>tat ca ngan hang</strong> tai Viet Nam co lien ket VNPay.
                  </div>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                  {[
                    { label: 'Cong thanh toan', value: 'VNPay Sandbox Gateway', color: '#005baa' },
                    { label: 'Ma giao dich', value: paymentData?.txnRef || 'Dang tao...', mono: true },
                    { label: 'So tien thanh toan', value: `${payAmount.toLocaleString('vi-VN')} d`, color: '#dc2626', size: '14px' },
                    { label: 'Doc gia', value: `${readerName} (DG-${String(readerId).padStart(3, '0')})` }
                  ].map((item, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '12.5px' }}>
                      <span style={{ color: '#64748b' }}>{item.label}:</span>
                      <strong style={{ color: item.color || '#0f172a', fontSize: item.size || '12.5px', fontFamily: item.mono ? 'monospace' : 'inherit' }}>
                        {item.value}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>NGAN HANG HO TRO</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {['Vietcombank', 'BIDV', 'VietinBank', 'Agribank', 'MBBank', 'Techcombank', 'TPBank', 'VPBank', 'ACB', 'Sacombank'].map(bank => (
                      <span key={bank} style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>{bank}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginTop: '10px', fontSize: '11.5px' }}>
                  <Clock size={13} color={countdown < 120 ? '#dc2626' : '#ea580c'} />
                  <span style={{ color: countdown < 120 ? '#dc2626' : '#64748b' }}>
                    Het han sau: <strong style={{ color: countdown < 120 ? '#dc2626' : '#ea580c' }}>{formatTime(countdown)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleConfirmPayment}
                disabled={confirmLoading || countdown <= 0}
                style={{
                  width: '100%',
                  background: confirmLoading || countdown <= 0 ? '#94a3b8' : 'linear-gradient(135deg,#005baa,#003e7e)',
                  color: '#fff', border: 'none', padding: '13px 18px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 800,
                  cursor: confirmLoading || countdown <= 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: confirmLoading || countdown <= 0 ? 'none' : '0 4px 16px rgba(0,91,170,0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {confirmLoading ? (
                  <><RefreshCw size={15} /><span>Dang xac nhan thanh toan...</span></>
                ) : countdown <= 0 ? (
                  <><AlertTriangle size={15} /><span>Giao dich da het han - Vui long thu lai</span></>
                ) : (
                  <><CheckCircle size={16} /><span>Toi da {activeTab === 'qr' ? 'chuyen khoan' : 'thanh toan'} - Xac nhan ngay</span></>
                )}
              </button>
              <p style={{ fontSize: '10.5px', color: '#94a3b8', textAlign: 'center', margin: '2px 0 0 0', lineHeight: 1.5 }}>
                Sau khi xac nhan, he thong gach no va tu dong mo khoa tai khoan tuc thi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}