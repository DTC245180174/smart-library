# 🗄️ SMARTLIB — THIẾT KẾ CƠ SỞ DỮ LIỆU TOÀN DIỆN (ERD 6 BẢNG CHUẨN 3NF MYSQL 8.0)
**Mô hình Quan hệ Logic Chuẩn hóa & Kiến trúc Thực thi Cơ sở Dữ liệu Thực tế Dual-Mode**
> Phiên bản tài liệu: 3.0 (Chuyển đổi hoàn toàn sang CSDL Quan hệ MySQL 8.0 Thực thi) | Ngày cập nhật: 08/09/2026  
> 📖 **Bộ tài liệu kỹ thuật SmartLib:** [📋 Yêu cầu (SRS)](requirements.md) | [📊 Ca sử dụng & Test Cases](use_cases.md) | [🗄️ Thiết kế CSDL (ERD 6 Bảng)](database_design.md) | [🤖 Nhật ký Prompt & AI Log](ai_log.md) | [🏠 Trang chủ README](../README.md)

---

## MỤC LỤC
1. [Tổng quan Kiến trúc Dữ liệu & Cơ chế Thực thi MySQL 8.0](#1-tổng-quan-kiến-trúc-dữ-liệu--cơ-chế-thực-thi-mysql-80)
2. [Sơ đồ Quan hệ Thực thể (ERD 6 Bảng Chuẩn 3NF)](#2-sơ-đồ-quan-hệ-thực-thể-erd-6-bảng-chuẩn-3nf)
3. [Đặc tả Chi tiết Cấu trúc 6 Bảng Dữ liệu](#3-đặc-tả-chi-tiết-cấu-trúc-6-bảng-dữ-liệu)
   - [3.1. Bảng `users` (Tài khoản & Hồ sơ: Admin, Librarian, Reader)](#31-bảng-users-tài-khoản--hồ-sơ-3-vai-trò)
   - [3.2. Bảng `books` (Kho sách - 50 đầu sách)](#32-bảng-books-kho-sách---50-đầu-sách)
   - [3.3. Bảng `borrow_records` (Phiếu mượn - trả sách)](#33-bảng-borrow_records-phiếu-mượn---trả-sách)
   - [3.4. Bảng `reservations` (Hàng đợi đặt trước sách FIFO 48h)](#34-bảng-reservations-hàng-đợi-đặt-trước-sách-fifo-48h)
   - [3.5. Bảng `fines` (Xử lý phạt quá hạn 2.000 đ/ngày)](#35-bảng-fines-xử-lý-phạt-quá-hạn-2000-đngày)
   - [3.6. Bảng `notifications` (Thông báo đa vai trò)](#36-bảng-notifications-thông-báo-đa-vai-trò)
4. [Lưu trữ Bền vững (Persistence) cho Reservations & Fines](#4-lưu-trữ-bền-vững-persistence-cho-reservations--fines)
5. [Quy chuẩn Ràng buộc Toàn vẹn & Khóa ngoại](#5-quy-chuẩn-ràng-buộc-toàn-vẹn--khóa-ngoại)
6. [Tập lệnh SQL DDL Khởi tạo CSDL MySQL 8.0](#6-tập-lệnh-sql-ddl-khởi-tạo-csdl-mysql-80)

---

## 1. TỔNG QUAN KIẾN TRÚC DỮ LIỆU & CƠ CHẾ THỰC THI MYSQL 8.0

Dự án **SmartLib v3.0** vận hành trực tiếp trên hệ quản trị cơ sở dữ liệu quan hệ **MySQL 8.0 / MariaDB** với cơ chế kết nối hiện đại **SQLAlchemy 2.0 ORM + PyMySQL Connection Pooling**. Đồng thời, hệ thống duy trì kiến trúc phòng vệ **Dual-Mode Persistence Architecture** đảm bảo vận hành linh hoạt trên mọi hạ tầng:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 SmartLib Web Application                │
                  │       (React 18 + Tailwind CSS + Lucide Icons)          │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                               ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │               FastAPI Backend RESTful API               │
                  │                 DatabaseManager (Singleton)             │
                  └──────────────┬───────────────────────────┬──────────────┘
                                 │                           │
          (Môi trường Backend)   │                           │  (Môi trường Trình duyệt
       Kết nối Trực tiếp MySQL   ▼                           ▼   GitHub Pages tĩnh)
  ┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
  │         HỆ QUẢN TRỊ CSDL MYSQL 8.0      │       │          LOCAL STORAGE ENGINE          │
  │        (smartlib_db - Chuẩn 3NF)       │       │       (Trình duyệt Client-side)        │
  ├────────────────────────────────────────┤       ├────────────────────────────────────────┤
  │ • SQLAlchemy 2.0 Connection Pool       │       │ • Tự động khởi tạo từ mockDatabase.json│
  │ • 6 Bảng quan hệ với Khóa ngoại (FK)   │       │ • Đồng bộ Realtime CustomEvents         │
  │ • users, books, borrow_records,        │       │ • Hỗ trợ triển khai tĩnh GitHub Pages  │
  │   reservations, fines, notifications   │       │ • Giữ vẹn nguyên 100% nghiệp vụ        │
  └────────────────────────────────────────┘       └────────────────────────────────────────┘
```

### Các ưu điểm vượt trội của kiến trúc CSDL thực tế:
1. **Dữ liệu thực tế 100%**: Toàn bộ thao tác CRUD (thêm, sửa, xóa, mượn, trả, gia hạn, đặt trước, tính phạt) được commit trực tiếp xuống CSDL MySQL với tính toàn vẹn giao dịch ACID.
2. **Loại bỏ hoàn toàn nguy cơ mất dữ liệu (Persistence)**: Cả `reservations` (hàng chờ đặt trước) và `fines` (thu tiền phạt quá hạn) đều có bảng vật lý riêng trong MySQL và mảng tương ứng trong JSON fallback, đảm bảo F5 trình duyệt hay restart backend server dữ liệu vẫn vẹn nguyên.
3. **Phân quyền 3 vai trò rõ rệt**: Hỗ trợ 3 tác nhân: **Admin** (Quản trị viên), **Librarian** (Thủ thư nghiệp vụ) và **Reader** (Độc giả mượn sách).

---

## 2. SƠ ĐỒ QUAN HỆ THỰC THỂ (ERD 6 BẢNG CHUẨN 3NF)

```
  ┌──────────────────────────────────┐               ┌──────────────────────────────────┐
  │              USERS               │               │              BOOKS               │
  │──────────────────────────────────│               │──────────────────────────────────│
  │ PK  id               INT         │               │ PK  id               INT         │
  │     username         VARCHAR(50) │               │     title            VARCHAR(255)│
  │     password_hash    VARCHAR(256)│               │     author           VARCHAR(100)│
  │     full_name        VARCHAR(100)│               │     category         VARCHAR(100)│
  │     role (Admin/Lib/Reader) ENUM │               │     quantity         INT         │
  │     email            VARCHAR(100)│               │     available_copies INT         │
  │     phone            VARCHAR(30) │               │     description      TEXT        │
  │     address          VARCHAR(255)│               │     image_url        VARCHAR(500)│
  │     birth_date       DATE        │               │     status           ENUM        │
  │     is_active        TINYINT(1)  │               │     published_year   INT         │
  └─────────┬──────────────┬─────────┘               └───────────┬──────────────┬───────┘
            │ 1            │ 1                                   │ 1            │ 1
            │              │                                     │              │
            │ N            │ N                                   │ N            │ N
            ▼              ▼                                     ▼              ▼
  ┌──────────────────┐   ┌─────────────────────────────────────────┐   ┌────────────────────┐
  │  NOTIFICATIONS   │   │             BORROW_RECORDS              │   │    RESERVATIONS    │
  │──────────────────│   │─────────────────────────────────────────│   │────────────────────│
  │ PK id        INT │   │ PK id                 INT               │   │ PK id          INT │
  │ FK recipient_user│   │ FK user_id            INT               │   │ FK user_id     INT │
  │    role      VAR │   │ FK book_id            INT               │   │ FK book_id     INT │
  │    title     VAR │   │    borrow_date        DATETIME          │   │    reserved_at DTM │
  │    message   TXT │   │    due_date           DATETIME          │   │    priority    INT │
  │    type      VAR │   │    return_date        DATETIME          │   │    expires_at  DTM │
  │    is_read   TIN │   │    actual_return_date DATETIME          │   │    status      ENM │
  └──────────────────┘   │    borrow_type        VARCHAR(50)       │   └────────────────────┘
                         │    fine_amount        DECIMAL(12,2)     │
                         │    overdue_days       INT               │
                         │    status             ENUM              │
                         │    notes              VARCHAR(255)      │
                         └────────────────────┬────────────────────┘
                                              │ 1
                                              │
                                              │ N
                                              ▼
                                 ┌─────────────────────────┐
                                 │          FINES          │
                                 │─────────────────────────│
                                 │ PK id                INT│
                                 │ FK record_id         INT│
                                 │ FK user_id           INT│
                                 │ FK book_id           INT│
                                 │    due_date     DATETIME│
                                 │    actual_return DATETIME│
                                 │    fine_amount  DEC(12,2)│
                                 │    status           ENUM│
                                 │    paid_at      DATETIME│
                                 │    note     VARCHAR(255)│
                                 └─────────────────────────┘
```

---

## 3. ĐẶC TẢ CHI TIẾT CẤU TRÚC 6 BẢNG DỮ LIỆU

### 3.1. Bảng `users` (Tài khoản & Hồ sơ 3 vai trò)
Lưu trữ thông tin tài khoản đăng nhập và hồ sơ người dùng cho cả 3 nhóm đối tượng: Quản trị viên (Admin), Thủ thư (Librarian), Độc giả (Reader).

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã định danh người dùng duy nhất |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE, INDEX | Tên đăng nhập hệ thống (admin, reader, librarian...) |
| `password_hash` | `VARCHAR(256)` | NOT NULL | Chuỗi băm mật khẩu bảo mật SHA-256 |
| `full_name` | `VARCHAR(100)` | NOT NULL | Họ và tên đầy đủ của người dùng |
| `role` | `ENUM('Admin','Librarian','Reader')` | NOT NULL, DEFAULT 'Reader' | Phân quyền 3 cấp tác nhân |
| `email` | `VARCHAR(100)` | NULLABLE | Thư điện tử nhận thông báo mượn trả |
| `phone` | `VARCHAR(30)` | NULLABLE | Số điện thoại liên hệ |
| `address` | `VARCHAR(255)` | NULLABLE | Địa chỉ liên lạc / Ký túc xá |
| `birth_date` | `DATE` | NULLABLE | Ngày tháng năm sinh |
| `is_active` | `TINYINT(1)` | NOT NULL, DEFAULT 1 | Trạng thái tài khoản (1: Đang hoạt động, 0: Khóa) |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày tạo tài khoản |
| `updated_at` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật gần nhất |

---

### 3.2. Bảng `books` (Kho sách - 50 đầu sách)
Quản lý toàn bộ 50 đầu sách thực tế trong thư viện, tự động cập nhật số lượng tồn kho và khả dụng.

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã số sách duy nhất |
| `title` | `VARCHAR(255)` | NOT NULL, INDEX | Tựa đề sách |
| `author` | `VARCHAR(100)` | NOT NULL, DEFAULT 'Chưa rõ' | Tên tác giả |
| `category` | `VARCHAR(100)` | NOT NULL, DEFAULT 'Chung', INDEX | Phân loại (Kỹ năng, Kinh tế, Lập trình...) |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Tổng số lượng sách nhập kho ban đầu |
| `available_copies`| `INT` | NOT NULL, DEFAULT 1 | Số lượng sách khả dụng trong kho ($0 \le 	ext{copies} \le 	ext{quantity}$) |
| `description` | `TEXT` | NULLABLE | Tóm tắt nội dung chi tiết của cuốn sách |
| `image_url` | `VARCHAR(500)` | NULLABLE | Đường dẫn ảnh bìa sách |
| `status` | `ENUM('Sẵn sàng','Hết sách','Bảo trì')`| NOT NULL, DEFAULT 'Sẵn sàng' | Trạng thái lưu thông sách |
| `published_year` | `INT` | NULLABLE | Năm xuất bản |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày thêm vào kho |
| `updated_at` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật gần nhất |

---

### 3.3. Bảng `borrow_records` (Phiếu mượn - trả sách)
Theo dõi từng giao dịch mượn sách, thời hạn trả, ngày trả thực tế, tình trạng duyệt và tiền phạt trễ hạn.

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã phiếu mượn |
| `user_id` | `INT` | NOT NULL, FK -> `users(id)`, INDEX | Khóa ngoại người mượn |
| `book_id` | `INT` | NOT NULL, FK -> `books(id)`, INDEX | Khóa ngoại cuốn sách mượn |
| `borrow_date` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Ngày giờ bắt đầu mượn |
| `due_date` | `DATETIME` | NOT NULL | Hạn chót hoàn trả sách |
| `return_date` | `DATETIME` | NULLABLE | Ngày hẹn trả |
| `actual_return_date`| `DATETIME` | NULLABLE | Ngày thực tế mang trả sách tại quầy |
| `borrow_type` | `VARCHAR(50)` | NOT NULL, DEFAULT 'Mượn về nhà' | Hình thức: Mượn về nhà / Đọc tại chỗ |
| `fine_amount` | `DECIMAL(12,2)`| NOT NULL, DEFAULT 0.00 | Số tiền phạt quá hạn (2.000 đ/ngày) |
| `overdue_days` | `INT` | NOT NULL, DEFAULT 0 | Số ngày quá hạn tính đến lúc trả |
| `status` | `ENUM('Chờ duyệt','Đang mượn','Đã trả','Quá hạn','Từ chối')` | NOT NULL, DEFAULT 'Chờ duyệt' | Trạng thái xử lý phiếu mượn |
| `notes` | `VARCHAR(255)` | NULLABLE | Ghi chú thêm của Thủ thư / Độc giả |

---

### 3.4. Bảng `reservations` (Hàng đợi đặt trước sách FIFO 48h)
Giải quyết bài toán bạn đọc muốn mượn sách khi kho đã hết (`available_copies = 0`).

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã thứ tự đặt trước |
| `user_id` | `INT` | NOT NULL, FK -> `users(id)`, INDEX | Khóa ngoại độc giả đặt trước |
| `book_id` | `INT` | NOT NULL, FK -> `books(id)`, INDEX | Khóa ngoại cuốn sách đặt trước |
| `reserved_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm đăng ký đặt (xếp hàng FIFO) |
| `priority` | `INT` | NOT NULL, DEFAULT 1 | Mức ưu tiên trong hàng đợi |
| `expires_at` | `DATETIME` | NOT NULL | Hạn giữ chỗ (mặc định 48h kể từ khi sách sẵn sàng) |
| `status` | `ENUM('Waiting','Ready','Cancelled','Completed')` | NOT NULL, DEFAULT 'Waiting' | Trạng thái đặt chỗ |

---

### 3.5. Bảng `fines` (Xử lý phạt quá hạn 2.000 đ/ngày)
Lưu trữ và theo dõi các khoản nợ tiền phạt vi phạm quy chế mượn trả của bạn đọc.

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã phiếu phạt |
| `record_id` | `INT` | NOT NULL, FK -> `borrow_records(id)` | Khóa ngoại liên kết phiếu mượn vi phạm |
| `user_id` | `INT` | NOT NULL, FK -> `users(id)`, INDEX | Khóa ngoại độc giả bị phạt |
| `book_id` | `INT` | NOT NULL, FK -> `books(id)` | Khóa ngoại cuốn sách liên quan |
| `due_date` | `DATETIME` | NOT NULL | Ngày hạn trả quy định |
| `actual_return_date`| `DATETIME` | NOT NULL | Ngày thực tế trả sách |
| `fine_amount` | `DECIMAL(12,2)`| NOT NULL, DEFAULT 0.00 | Số tiền phạt = (Ngày trễ) * 2.000 đ |
| `status` | `ENUM('Chưa nộp','Đã nộp')` | NOT NULL, DEFAULT 'Chưa nộp' | Trạng thái thu tiền phạt |
| `paid_at` | `DATETIME` | NULLABLE | Ngày giờ độc giả hoàn tất nộp tiền |
| `note` | `VARCHAR(255)` | NULLABLE | Ghi chú lý do phạt / số ngày trễ |

---

### 3.6. Bảng `notifications` (Thông báo đa vai trò)
Lưu trữ lịch sử thông báo gửi đến từng người dùng hoặc gửi phát thanh theo vai trò.

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Ghi Chú |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Mã thông báo duy nhất |
| `recipient_role` | `VARCHAR(20)` | NOT NULL, INDEX | Vai trò nhận: `'all'`, `'Reader'`, `'Librarian'`, `'Admin'` |
| `recipient_user_id` | `INT` | NULLABLE, FK -> `users(id)` | Khóa ngoại gửi riêng đích danh độc giả (nếu có) |
| `title` | `VARCHAR(255)` | NOT NULL | Tiêu đề thông báo ngắn gọn |
| `message` | `TEXT` | NOT NULL | Nội dung thông báo chi tiết |
| `type` | `VARCHAR(50)` | NOT NULL, DEFAULT 'general' | Phân loại: `borrow_approved`, `overdue_fine`, `reserved_ready`... |
| `is_read` | `TINYINT(1)` | NOT NULL, DEFAULT 0, INDEX | 0: Chưa đọc, 1: Đã đọc |
| `meta_json` | `JSON` | NULLABLE | Dữ liệu bổ sung đi kèm dạng JSON |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm phát sinh thông báo |

---

## 4. LƯU TRỮ BỀN VỮNG (PERSISTENCE) CHO RESERVATIONS & FINES

Để khắc phục triệt để câu hỏi đặt ra trong thực tế vận hành:
> *"Nếu reservations hay fines chỉ lưu tạm trong state React (RAM), thì khi F5 hoặc restart server sẽ bị mất sạch dữ liệu?"*

Dự án **SmartLib v3.0** cam kết lưu trữ bền vững (Persistence) 100%:
1. **Ở chế độ MySQL (Mặc định khi bật Server)**:
   - Khi độc giả bấm "Đặt trước", bản ghi được INSERT trực tiếp vào bảng `reservations` trong MySQL.
   - Khi độc giả trả sách quá hạn, backend tự động tính tiền `overdue_days * 2000` VNĐ và INSERT bản ghi vào bảng `fines` trong MySQL.
   - Khi Thủ thư bấm "Thu tiền phạt", bản ghi trong bảng `fines` được UPDATE `status = 'Đã nộp'` và ghi nhận `paid_at = NOW()`.
   - Mọi thao tác đều thực thi câu lệnh SQL thực tế trên MySQL, không tồn tại ở dạng RAM tạm bợ.
2. **Ở môi trường Demo Tĩnh (GitHub Pages)**:
   - Các mảng `reservations` và `fines` được ghi tuần tự vào `localStorage['smartlib_db']` của trình duyệt.
   - F5 trình duyệt hay mở nhiều tab dữ liệu vẫn được đồng bộ và đọc ra nguyên vẹn.

---

## 5. QUY CHUẨN RÀNG BUỘC TOÀN VẸN & KHÓA NGOẠI

1. **Toàn vẹn khóa ngoại (Referential Integrity)**:
   - Mọi bản ghi `borrow_records`, `reservations`, `fines`, `notifications` đều tham chiếu hợp lệ đến `users.id` và `books.id`.
   - Quy tắc xóa (`ON DELETE CASCADE`): Khi xóa một bản ghi cha, các bản ghi phụ thuộc được cascade an toàn. Trong nghiệp vụ thực tế, người dùng có phiếu mượn đang active sẽ bị hệ thống chặn xóa ở tầng service layer (`Defensive Check`).
2. **Công thức quản lý kho sách**:
   $$	ext{available\_copies} = 	ext{quantity} - \sum (	ext{đang mượn trong borrow\_records})$$
   Đảm bảo giá trị $	ext{available\_copies} \ge 0$ và $\le 	ext{quantity}$.
3. **Quy tắc hàng đợi FIFO đặt trước**:
   - Khi sách hết kho ($	ext{available\_copies} = 0$), bạn đọc được phép đặt trước.
   - Khi có độc giả trả sách, người có `reserved_at` sớm nhất được ưu tiên giữ sách trong vòng 48 giờ.

---

## 6. TẬP LỆNH SQL DDL KHỞI TẠO CSDL MYSQL 8.0

Tập lệnh SQL đầy đủ được lưu tại tệp [database/smartlib_mysql.sql](../database/smartlib_mysql.sql), bao gồm toàn bộ 6 bảng chuẩn 3NF và 50 đầu sách mẫu:

```sql
CREATE DATABASE IF NOT EXISTS smartlib_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smartlib_db;

-- 1. Bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Librarian', 'Reader') NOT NULL DEFAULT 'Reader',
    email VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    address VARCHAR(255) NULL,
    birth_date DATE NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng books
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Chưa rõ',
    category VARCHAR(100) NOT NULL DEFAULT 'Chung',
    quantity INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    status ENUM('Sẵn sàng', 'Hết sách', 'Bảo trì') NOT NULL DEFAULT 'Sẵn sàng',
    published_year INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_books_title (title),
    INDEX idx_books_category (category),
    INDEX idx_books_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng borrow_records
CREATE TABLE borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    return_date DATETIME NULL,
    actual_return_date DATETIME NULL,
    borrow_type VARCHAR(50) NOT NULL DEFAULT 'Mượn về nhà',
    fine_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    overdue_days INT NOT NULL DEFAULT 0,
    status ENUM('Chờ duyệt', 'Đang mượn', 'Đã trả', 'Quá hạn', 'Từ chối') NOT NULL DEFAULT 'Chờ duyệt',
    notes VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_borrow_user (user_id),
    INDEX idx_borrow_book (book_id),
    INDEX idx_borrow_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng reservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    reserved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority INT NOT NULL DEFAULT 1,
    expires_at DATETIME NOT NULL,
    status ENUM('Waiting', 'Ready', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Waiting',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_res_user (user_id),
    INDEX idx_res_book (book_id),
    INDEX idx_res_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng fines
CREATE TABLE fines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    due_date DATETIME NOT NULL,
    actual_return_date DATETIME NOT NULL,
    fine_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status ENUM('Chưa nộp', 'Đã nộp') NOT NULL DEFAULT 'Chưa nộp',
    paid_at DATETIME NULL,
    note VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fine_record FOREIGN KEY (record_id) REFERENCES borrow_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_fine_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fine_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_fines_user (user_id),
    INDEX idx_fines_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_role VARCHAR(20) NOT NULL,
    recipient_user_id INT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'general',
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    meta_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_recipient (recipient_role, recipient_user_id),
    INDEX idx_notif_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

*Tài liệu Thiết kế Cơ sở Dữ liệu này chuẩn hóa và đồng bộ 100% giữa mô hình quan hệ logic 6 bảng, tệp DDL `smartlib_mysql.sql` và mã nguồn triển khai thực tế của Dự án SmartLib v3.0.*
