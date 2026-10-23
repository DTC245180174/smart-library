"""
Kịch bản khởi tạo / nạp lại CSDL MySQL 8.0 từ tệp SQL (SmartLib SQL Init Script)
Cách dùng:
    python backend/migrate_to_mysql.py
"""
import os
import sys
import logging
from sqlalchemy import text

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mysql_db import (
    MySQLDatabaseManager,
    UserModel,
    BookModel,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_DATABASE
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("smartlib.sql_init")


def run_migration():
    sql_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "database", "smartlib_mysql.sql"))
    if not os.path.exists(sql_path):
        logger.error(f"Không tìm thấy tệp {sql_path}")
        return False

    logger.info("=== BẮT ĐẦU KHỞI TẠO CƠ SỞ DỮ LIỆU MYSQL TỪ TỆP SMARTLIB_MYSQL.SQL ===")
    logger.info(f"Cấu hình MySQL: {MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")

    db_manager = MySQLDatabaseManager()
    if not db_manager.is_connected():
        logger.error("❌ Không thể kết nối tới MySQL Server!")
        logger.error("Gợi ý khắc phục: Đảm bảo dịch vụ MySQL Server hoặc Docker Desktop đang bật.")
        return False

    with open(sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    session = db_manager.SessionLocal()
    try:
        for statement in sql_content.split(";\n"):
            stmt = statement.strip()
            if stmt and not stmt.upper().startswith("CREATE DATABASE") and not stmt.upper().startswith("USE ") and not stmt.upper().startswith("SET "):
                try:
                    session.execute(text(stmt))
                except Exception as ex:
                    logger.debug(f"Bỏ qua: {ex}")
        session.commit()

        u_count = session.query(UserModel).count()
        b_count = session.query(BookModel).count()
        logger.info("==================================================")
        logger.info("🎉 NẠP DỮ LIỆU TỪ SQL VÀO MYSQL THÀNH CÔNG!")
        logger.info(f"- Người dùng (users): {u_count} bản ghi")
        logger.info(f"- Kho sách (books): {b_count} đầu sách")
        logger.info("==================================================")
        return True
    except Exception as e:
        session.rollback()
        logger.error(f"Lỗi khi thực thi SQL: {e}")
        return False
    finally:
        session.close()


if __name__ == "__main__":
    run_migration()
