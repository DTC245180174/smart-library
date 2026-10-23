import os
import sys
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

logger = logging.getLogger("smartlib.database")

# Tự động đọc file .env từ thư mục gốc nếu có
def _load_env():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

_load_env()

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from mysql_db import MySQLDatabaseManager
except ImportError:
    from backend.mysql_db import MySQLDatabaseManager


class DatabaseManager:
    """
    Quản trị CSDL Quan hệ MySQL 8.0 Chuẩn 3NF:
    100% dữ liệu (Sách, Độc giả, Phiếu mượn, Đặt trước, Tiền phạt, Thông báo)
    được lưu trữ, truy vấn và commit trực tiếp trên máy chủ MySQL thực tế.
    """
    def __init__(self):
        self.mysql_mgr = MySQLDatabaseManager()
        self._active_engine = "mysql"
        if not self.mysql_mgr.is_connected():
            logger.warning("⚠️ Chưa kết nối được MySQL Server! Hãy đảm bảo dịch vụ MySQL đang chạy trên máy tính hoặc Docker.")
        else:
            logger.info("⚡ SmartLib đang vận hành 100% trên CƠ SỞ DỮ LIỆU MYSQL 8.0 (smartlib_db).")

    @property
    def active_engine(self) -> str:
        return "mysql"

    def is_connected(self) -> bool:
        return self.mysql_mgr.is_connected()

    def load_db(self) -> Dict[str, Any]:
        """Đọc trực tiếp dữ liệu từ các bảng MySQL hoặc SQLite qua RAM cache siêu tốc"""
        return self.mysql_mgr.load_db()

    def save_db(self, data: Dict[str, Any]):
        """Lưu và đồng bộ trực tiếp các bản ghi vào MySQL và SQLite"""
        self.mysql_mgr.save_db(data)

    def atomic_borrow_book(
        self,
        user_id: int,
        book_id: int,
        borrow_type: str = "Mượn về nhà",
        due_date: Optional[datetime] = None,
        init_status: str = "Chờ duyệt"
    ) -> Dict[str, Any]:
        """Thực hiện mượn sách với khóa giao dịch Pessimistic Lock chống Race Condition"""
        return self.mysql_mgr.atomic_borrow_book(
            user_id=user_id,
            book_id=book_id,
            borrow_type=borrow_type,
            due_date=due_date,
            init_status=init_status
        )

    def add_notification(
        self,
        recipient_role: str,
        title: str,
        message: str,
        notif_type: str = "general",
        recipient_user_id: Optional[int] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Tạo thông báo mới lưu trực tiếp vào bảng notifications trong MySQL"""
        return self.mysql_mgr.add_notification(
            recipient_role=recipient_role,
            title=title,
            message=message,
            notif_type=notif_type,
            recipient_user_id=recipient_user_id,
            meta=meta
        )

    def calculate_fine(self, record: Dict[str, Any]) -> float:
        """Tính toán tiền phạt trễ hạn theo công thức số ngày trễ * 2.000 đ"""
        return self.mysql_mgr.calculate_fine(record)

    def save_fine_record(self, borrow_record: Dict[str, Any], fine_amount: float) -> Optional[Dict[str, Any]]:
        """Lưu phiếu phạt vi phạm trực tiếp vào bảng fines trong MySQL"""
        return self.mysql_mgr.save_fine_record(borrow_record, fine_amount)


    def mark_notification_read(self, notif_id: int):
        """Đánh dấu một thông báo là đã đọc trong MySQL"""
        return self.mysql_mgr.mark_notification_read(notif_id)

    def mark_all_notifications_read(self, role: Optional[str] = None, user_id: Optional[int] = None):
        """Đánh dấu tất cả thông báo là đã đọc trong MySQL"""
        return self.mysql_mgr.mark_all_notifications_read(role=role, user_id=user_id)

    def delete_notification(self, notif_id: int):
        """Xóa một thông báo trong MySQL"""
        return self.mysql_mgr.delete_notification(notif_id)

    def clear_read_notifications(self, role: Optional[str] = None, user_id: Optional[int] = None):
        """Dọn dẹp các thông báo đã đọc trong MySQL"""
        return self.mysql_mgr.clear_read_notifications(role=role, user_id=user_id)

    def delete_book(self, book_id: int):
        """Xóa sách và toàn bộ dữ liệu phụ thuộc trên cả MySQL và SQLite"""
        return self.mysql_mgr.delete_book(book_id)

    def cancel_reservation(self, res_id: int):
        """Hủy đặt trước sách trên cả MySQL và SQLite"""
        return self.mysql_mgr.cancel_reservation(res_id)

    def toggle_reader_lock(self, reader_id: int, is_locked: bool, reason: Optional[str] = None):
        """Khóa hoặc mở khóa tài khoản độc giả"""
        return self.mysql_mgr.toggle_reader_lock(reader_id, is_locked, reason)


# Khởi tạo Singleton Database Manager kết nối trực tiếp MySQL
db_manager = DatabaseManager()

