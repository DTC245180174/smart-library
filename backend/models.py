from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    fullName: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    birthDate: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    birthDate: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

class BookCreate(BaseModel):
    title: str
    author: Optional[str] = "Chưa rõ"
    category: Optional[str] = "Khác"
    quantity: int = 1
    expectedQuantity: Optional[int] = None
    desc: Optional[str] = ""
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    status: Optional[str] = "Sẵn sàng"
    releaseDate: Optional[str] = None
    isUpcoming: Optional[bool] = False

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    expectedQuantity: Optional[int] = None
    desc: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    status: Optional[str] = None
    releaseDate: Optional[str] = None
    isUpcoming: Optional[bool] = None

class ReaderCreate(BaseModel):
    fullName: str
    username: Optional[str] = None
    password: Optional[str] = "123"
    email: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    birthDate: Optional[str] = None

class ReaderUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    birthDate: Optional[str] = None

class BorrowRequestCreate(BaseModel):
    bookId: int
    userId: Optional[int] = None
    readerId: Optional[int] = None
    readerName: Optional[str] = None
    bookTitle: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    birthDate: Optional[str] = None
    borrowType: Optional[str] = "Mượn về nhà"
    status: Optional[str] = "Chờ duyệt"

class BorrowStatusUpdate(BaseModel):
    status: str

class NotificationReadRequest(BaseModel):
    role: Optional[str] = None
    userId: Optional[int] = None

class ReservationCreate(BaseModel):
    bookId: int
    readerId: Optional[int] = None
    userId: Optional[int] = None

class ReservationUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[int] = None
    expiresAt: Optional[str] = None

class FineStatusUpdate(BaseModel):
    status: Optional[str] = "Đã nộp"
    note: Optional[str] = None
    paymentMethod: Optional[str] = "Tiền mặt"
    transactionRef: Optional[str] = None

class ReaderLockUpdate(BaseModel):
    isLocked: bool
    reason: Optional[str] = None

class VNPayPaymentCreate(BaseModel):
    fineId: Optional[int] = None
    readerId: int
    amount: float
    orderInfo: Optional[str] = None
    bankCode: Optional[str] = None

class VNPayPaymentVerify(BaseModel):
    fineId: Optional[int] = None
    readerId: int
    transactionRef: str
    amount: float
    status: Optional[str] = "SUCCESS"

class SystemSettings(BaseModel):
    borrowHomeDays: Optional[int] = 14
    borrowLibraryDays: Optional[int] = 7
    maxBorrowBooks: Optional[int] = 3
    maxReservations: Optional[int] = 3
    finePerDay: Optional[int] = 2000
    gracePeriodDays: Optional[int] = 0
    autoLockAfterDays: Optional[int] = 3
    lostBookFine: Optional[int] = 200000
    vnpayTmnCode: Optional[str] = ""
    vnpayHashSecret: Optional[str] = ""
    vnpayAccountNumber: Optional[str] = "0987654321"
    vnpayBankName: Optional[str] = "Ngân hàng TMCP Quân Đội (MBBank)"
    vnpayBankBin: Optional[str] = "970422"
    vnpayAccountName: Optional[str] = "THU VIEN SMARTLIB"
    vnpayTimeoutMinutes: Optional[int] = 15
    libraryName: Optional[str] = "SmartLib - Thư viện Thông minh"
    libraryAddress: Optional[str] = "Hà Nội, Việt Nam"
    libraryPhone: Optional[str] = "0987 654 321"
    libraryEmail: Optional[str] = "support@smartlib.edu.vn"
    libraryHours: Optional[str] = "07:30 - 17:30 (Thứ 2 - Thứ 7)"

class FineRejectRequest(BaseModel):
    reason: Optional[str] = "Giao dịch không hợp lệ hoặc chưa nhận được tiền"

class BorrowRenewRequest(BaseModel):
    days: int = 7
    notes: Optional[str] = None