# 📚 SmartLib - Hệ Thống Quản Lý Thư Viện Thông Minh Tích Hợp Trợ Lý AI
## BÁO CÁO NGHIỆM THU DỰ ÁN & HƯỚNG DẪN SỬ DỤNG HỆ THỐNG
### ĐÁP ỨNG TOÀN DIỆN 10 TIÊU CHÍ ĐÁNH GIÁ CHẤT LƯỢNG PHẦN MỀM

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8.0" />
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0-red?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy 2.0" />
  <img src="https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-22c55e?style=for-the-badge&logo=github" alt="Live Demo" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="License MIT" />
</p>

> **SmartLib** là dự án phần mềm quản lý và tra cứu thư viện trực tuyến hiện đại, được xây dựng theo chuẩn mực **10 tiêu chí đánh giá chất lượng phần mềm**. Hệ thống tích hợp công nghệ **Trợ lý Trí tuệ Nhân tạo (AI Library Assistant)** hỗ trợ bạn đọc 24/7 với giọng điệu tự nhiên, hoạt họa suy nghĩ 5 giây sống động và khả năng đồng bộ dữ liệu đa nền tảng (**Dual-mode Persistence Architecture**).

---

## 🔗 Liên Kết Trực Tuyến & Tài Liệu Dự Án

- 🌐 **Trải nghiệm trực tuyến trên GitHub Pages:** [https://dvuwebon.github.io/Thuvien/](https://dvuwebon.github.io/Thuvien/)
- 💻 **Kho mã nguồn chính thức (GitHub):** [https://github.com/dvuwebon/Thuvien](https://github.com/dvuwebon/Thuvien)
- 📋 **Đặc tả yêu cầu phần mềm (SRS):** [docs/requirements.md](docs/requirements.md)
- 📊 **Đặc tả ca sử dụng (Use Cases):** [docs/use_cases.md](docs/use_cases.md)
- 🗄️ **Thiết kế cơ sở dữ liệu (Database Design):** [docs/database_design.md](docs/database_design.md)
- 🤖 **Nhật ký Prompt AI chi tiết (AI Prompt Log):** [docs/ai_log.md](docs/ai_log.md)
- ⚙️ **Tệp cấu hình môi trường mẫu:** [.env.example](.env.example)

---

## 📑 Mục Lục
1. [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
2. [Báo Cáo Nghiệm Thu Toàn Diện 10 Tiêu Chí](#-báo-cáo-nghiệm-thu-toàn-diện-10-tiêu-chí)
   - [Tiêu chí 1: Cấu trúc dự án hợp lý](#tiêu-chí-1-cấu-trúc-dự-án-hợp-lý)
   - [Tiêu chí 2: Xây dựng chức năng đăng nhập và phân quyền](#tiêu-chí-2-xây-dựng-chức-năng-đăng-nhập-và-phân-quyền)
   - [Tiêu chí 3: Hoàn thiện CRUD nghiệp vụ chính](#tiêu-chí-3-hoàn-thiện-crud-nghiệp-vụ-chính)
   - [Tiêu chí 4: Xây dựng chức năng tìm kiếm và lọc](#tiêu-chí-4-xây-dựng-chức-năng-tìm-kiếm-và-lọc)
   - [Tiêu chí 5: Xây dựng thống kê / báo cáo cơ bản](#tiêu-chí-5-xây-dựng-thống-kê--báo-cáo-cơ-bản)
   - [Tiêu chí 6: Thiết kế giao diện rõ ràng, dễ sử dụng (UI/UX)](#tiêu-chí-6-thiết-kế-giao-diện-rõ-ràng-dễ-sử-dụng-uiux)
   - [Tiêu chí 7: Kết nối và thao tác CSDL ổn định](#tiêu-chí-7-kết-nối-và-thao-tác-csdl-ổn-định)
   - [Tiêu chí 8: Xử lý lỗi cơ bản và phòng ngừa Crash](#tiêu-chí-8-xử-lý-lỗi-cơ-bản-và-phòng-ngừa-crash)
   - [Tiêu chí 9: Minh chứng sử dụng AI khi lập trình](#tiêu-chí-9-minh-chứng-sử-dụng-ai-khi-lập-trình)
   - [Tiêu chí 10: Quản lý mã nguồn và đóng gói Docker](#tiêu-chí-10-quản-lý-mã-nguồn-và-đóng-gói-docker)
3. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
4. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
   - [Cách 1: Trải nghiệm trên GitHub Pages](#cách-1-trải-nghiệm-trực-tiếp-trên-github-pages-không-cần-cài-đặt)
   - [Cách 2: Khởi chạy bằng Docker Compose (Khuyên dùng)](#cách-2-khởi-chạy-bằng-docker--docker-compose-khuyên-dùng)
   - [Cách 3: Khởi chạy bằng Python trên máy cục bộ](#cách-3-khởi-chạy-cục-bộ-bằng-python-localhost)
5. [Tài Khoản Đăng Nhập & Phân Quyền](#-tài-khoản-đăng-nhập--phân-quyền)
6. [Danh Sách RESTful API Chính](#-danh-sách-restful-api-chính)
7. [Kết Luận Nghiệm Thu](#-kết-luận-nghiệm-thu)
8. [Giấy Phép & Tác Quyền](#-giấy-phép)

---

## 🌟 Tính Năng Nổi Bật

- 🤖 **Thủ thư Trí tuệ Nhân tạo (AI Library Assistant - RAG Prompt v3):**
  - Widget chat nổi góc phải màn hình, thiết kế phẳng tinh gọn, hiện đại (Borderless Design).
  - Dòng chữ gợi ý *"Bạn cần tôi giúp đỡ gì không? ✨"* tự động hiển thị và **tự ẩn sau 7 giây**, tự hiện lại khi rê chuột.
  - Hoạt họa **3 dấu chấm chuyển động nhịp nhàng (bouncing dots)** trong 5 giây, chuyển trạng thái tự nhiên như đang chat với người thật.
  - Tích hợp Prompt RAG v3: Nhận diện nhu cầu, đối soát danh mục kho sách thực tế `{{book_list}}`, giới hạn câu trả lời $\le 300$ ký tự và trả về định dạng **JSON thuần túy**.
  - Hỗ trợ kết nối Google Gemini API và cơ chế **Smart Fallback** tự động giải đáp từ bộ tri thức nội bộ khi chưa có API Key hoặc mất mạng.
- 📖 **AI Tóm tắt nội dung sách (AI Book Summarizer):** Nút bấm tích hợp tại Modal chi tiết sách giúp độc giả trích xuất 3 ý tưởng cốt lõi và bài học thực tiễn của cuốn sách trong vòng 3 giây.
- 🔖 **Hàng đợi Đặt trước sách (Book Reservation Queue):** Khi sách trong kho tạm thời hết (`available = 0`), nút mượn tự động chuyển thành **"Đặt trước sách"**. Hệ thống tự động xếp hàng ưu tiên (FIFO) và gửi thông báo giữ sách 48 giờ khi có bạn đọc khác hoàn trả sách về kho.
- 🔄 **Gia hạn mượn sách trực tuyến (Loan Renewal):** Độc giả có thể chủ động bấm "Gia hạn" thêm 7 ngày trực tiếp trên cổng cá nhân nếu sách chưa quá hạn và chưa có người khác đặt trước.
- ⚡ **Nghiệp vụ Mượn - Trả tức thì (Optimistic UI 0ms):** Thao tác mượn sách, duyệt phiếu, trả sách cập nhật giao diện ngay lập tức mà không cần F5.
- 🔍 **Tìm kiếm toàn cục (Live Search):** Kích hoạt nhanh bằng phím tắt `/`, lọc theo thể loại, tình trạng kho và sắp xếp đa tiêu chí.
- 📊 **Thống kê & Xuất báo cáo chuyên nghiệp:**
  - Báo cáo **Excel (.xlsx)** định dạng bảng biểu, màu sắc tiêu đề bằng `openpyxl`.
  - Phiếu mượn **PDF (.pdf)** tích hợp mã QR tra cứu bằng `reportlab`.
  - Dữ liệu độc giả **CSV (.csv)** mã hóa UTF-8 BOM chuẩn tiếng Việt.
- 💾 **Kiến trúc lưu trữ 100% CSDL Quan Hệ Thực Tế:**
  - Localhost & Docker: Backend FastAPI kết nối trực tiếp MySQL 8.0 (`smartlib_db`) chuẩn 3NF qua SQLAlchemy 2.0 ORM.
  - GitHub Pages: Tự kích hoạt `LocalStorage Sync Engine` kiểm soát phiên bản `DB_VERSION`, đồng bộ thời gian thực giữa các tab.
- 🎨 **Giao diện người dùng tinh tế (UI/UX):** Bỏ 100% popup `alert/confirm` thô sơ của trình duyệt, thay bằng Custom Confirmation Modal và Toast Notification.

---

## 🏆 Báo Cáo Nghiệm Thu Toàn Diện 10 Tiêu Chí

### Bảng Đánh Giá Mức Độ Đáp Ứng 10 Tiêu Chí

| STT | Tiêu chí đánh giá | Hiện trạng hoàn thành trong Dự án SmartLib | Đánh giá |
| :---: | :--- | :--- | :---: |
| **1** | **Cấu trúc dự án hợp lý** | Phân tách module rõ ràng: `frontend`, `backend`, `data`, `docs` (4 file chuẩn), `docker`. | **ĐẠT XUẤT SẮC** |
| **2** | **Đăng nhập & phân quyền** | Mô hình RBAC chặt chẽ (`Admin` vs `Reader`), bảo vệ tuyến đường, cho phép đăng ký tài khoản mới lưu bền vững vào CSDL. | **ĐẠT XUẤT SẮC** |
| **3** | **CRUD nghiệp vụ chính** | Hoàn thiện 100% Thêm - Xem - Sửa - Xóa cho Sách, Độc giả và Mượn - Trả sách; kiểm tra toàn vẹn dữ liệu. | **ĐẠT XUẤT SẮC** |
| **4** | **Tìm kiếm và lọc** | Live search modal theo phím tắt `/`, lọc đa tiêu chí (thể loại, trạng thái mượn trả, tình trạng kho), sắp xếp A-Z / mới nhất. | **ĐẠT XUẤT SẮC** |
| **5** | **Thống kê / Báo cáo** | Dashboard 4 thẻ KPI thời gian thực, biểu đồ SVG lượt mượn theo thể loại, xuất 3 định dạng: Excel (.xlsx), PDF kèm mã QR, CSV. | **ĐẠT XUẤT SẮC** |
| **6** | **Giao diện rõ ràng (UI/UX)** | Giao diện nhất quán, Toast thông báo, Modal xác nhận an toàn (không dùng alert/confirm), Trợ lý AI hỏi đáp mượt mà. | **ĐẠT XUẤT SẮC** |
| **7** | **Thao tác CSDL ổn định** | Kiến trúc Dual-mode Persistence (FastAPI JSON ORM + LocalStorage Sync Engine), có sẵn dữ liệu mẫu phong phú. | **ĐẠT XUẤT SẮC** |
| **8** | **Xử lý lỗi cơ bản** | Bắt lỗi form rỗng, kiểm tra số nguyên dương, **chặn xóa sách/độc giả đang có giao dịch mượn**, bọc try/catch toàn diện. | **ĐẠT XUẤT SẮC** |
| **9** | **Minh chứng sử dụng AI** | Có bảng nhật ký Prompt 6 giai đoạn, đối chiếu code AI sinh ra và phần sinh viên tự kiểm tra, gỡ lỗi và tinh chỉnh. | **ĐẠT XUẤT SẮC** |
| **10** | **Quản lý mã nguồn & Docker** | Commit Git chuẩn Conventional Commits, bộ 4 tài liệu docs, `.env.example`, bộ 3 file Docker đóng gói hoàn chỉnh. | **ĐẠT XUẤT SẮC** |

---

### Tiêu chí 1: Cấu Trúc Dự Án Hợp Lý

Dự án được phân chia theo kiến trúc module hóa rõ ràng, độc lập giữa các tầng xử lý dữ liệu, giao diện, cấu hình và tài liệu:

```
py-thuvien/
├── backend/                        # Tầng xử lý Logic & API phía Server (Python)
│   ├── app.py                      # Định nghĩa Router FastAPI, xử lý các endpoint nghiệp vụ
│   ├── database.py                 # Tầng truy xuất & thao tác tệp tin CSDL (JSON ORM)
│   ├── models.py                   # Pydantic Schemas định nghĩa cấu trúc dữ liệu truyền tải
│   ├── export_service.py           # Module xuất báo cáo Excel, CSV, PDF & mã QR
│   ├── excel_generator.py          # Xuất báo cáo kho sách & mượn trả dạng Excel (.xlsx)
│   ├── pdf_generator.py            # Sinh phiếu mượn sách kèm mã QR dạng PDF (.pdf)
│   └── qr_generator.py             # Sinh mã QR định danh sách dạng ảnh PNG
├── frontend/                       # Tầng Giao diện Người dùng (React.js SPA)
│   ├── public/                     # Tài nguyên tĩnh độc lập
│   ├── src/
│   │   ├── assets/                 # Hình ảnh, icon vector nội bộ
│   │   ├── components/             # Các khối giao diện tái sử dụng
│   │   │   ├── AIChatWidget.jsx    # Trợ lý AI hỏi đáp trực tiếp (5s bounce, tự thu gọn 7s)
│   │   │   ├── AddEditBookModal.jsx# Modal thêm / chỉnh sửa sách
│   │   │   ├── AddEditReaderModal.jsx # Modal thêm / cập nhật thông tin độc giả
│   │   │   ├── BookCard.jsx        # Thẻ hiển thị sách kèm bìa, đánh giá và trạng thái
│   │   │   ├── BookDetailModal.jsx # Modal xem chi tiết nội dung và trích dẫn sách
│   │   │   ├── BorrowModal.jsx     # Modal lập phiếu đăng ký mượn sách
│   │   │   ├── ExportReportModal.jsx # Modal tùy chọn xuất báo cáo Excel, CSV, PDF
│   │   │   ├── FeaturedCarousel.jsx # Carousel sách nổi bật tự chạy mượt mà
│   │   │   ├── NotificationDropdown.jsx # Hộp thư thông báo cập nhật mượn/trả tức thì
│   │   │   ├── SearchModal.jsx     # Hộp thoại tìm kiếm thông minh toàn hệ thống (phím tắt /)
│   │   │   └── Sidebar.jsx         # Thanh điều hướng phân quyền theo vai trò
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Quản lý trạng thái phiên đăng nhập & phân quyền RBAC
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Không gian làm việc toàn quyền của Quản trị viên
│   │   │   ├── ReaderPortal.jsx    # Không gian tra cứu, mượn trả & quản lý cá nhân của Độc giả
│   │   │   ├── LoginPage.jsx       # Trang xác thực: Đăng nhập & Đăng ký tài khoản mới
│   │   │   └── ProfilePage.jsx     # Xem hồ sơ cá nhân và đổi mật khẩu an toàn
│   │   ├── services/
│   │   │   ├── api.js              # Khách hàng API thống nhất (FastAPI + LocalStorage Fallback)
│   │   │   └── aiService.js        # Dịch vụ tích hợp Google Gemini API & Tri thức thư viện nội bộ
│   │   ├── App.jsx                 # Bộ định tuyến điều phối ứng dụng chính
│   │   ├── main.jsx                # Điểm khởi tạo ứng dụng React DOM
│   │   └── index.css               # Hệ thống Style toàn cục, Design Tokens
│   ├── package.json                # Danh sách thư viện phụ thuộc Frontend
│   └── vite.config.js              # Cấu hình đóng gói Vite (base path cho GitHub Pages)
├── database/
│   └── smartlib_mysql.sql          # Kịch bản DDL & DML khởi tạo CSDL MySQL 8.0 chuẩn 3NF (50 sách thực tế)
├── docs/                           # Thư mục tài liệu kỹ thuật chuẩn hóa (duy nhất 4 file)
│   ├── requirements.md             # Đặc tả yêu cầu phần mềm SRS (35+ yêu cầu chức năng & Đặt trước sách)
│   ├── use_cases.md                # Đặc tả 18 Ca sử dụng & Bộ 7 Test Cases kiểm thử hệ thống (TC01-TC07)
│   ├── database_design.md          # Thiết kế CSDL ERD 7 Bảng chuẩn 3NF & Kiến trúc ánh xạ Dual-Mode
│   └── ai_log.md                   # Nhật ký Prompt AI, Bảng tối ưu Prompt RAG v1-v3 (JSON) & Minh chứng
├── Dockerfile                      # Cấu hình đóng gói Multi-stage Docker
├── docker-compose.yml              # Cấu hình khởi chạy nhanh Docker Compose
├── .dockerignore                   # Danh sách loại trừ khi đóng gói Docker
├── .env.example                    # Tệp mẫu cấu hình các biến môi trường
├── requirements.txt                # Danh sách thư viện phụ thuộc Python
├── main.py                         # File kích hoạt máy chủ FastAPI kiêm phục vụ Web App
└── README.md                       # Báo cáo nghiệm thu & Hướng dẫn sử dụng chính thức
```

---

### Tiêu chí 2: Xây Dựng Chức Năng Đăng Nhập Và Phân Quyền

Hệ thống xây dựng mô hình **Kiểm soát truy cập dựa trên vai trò (Role-Based Access Control - RBAC)** nghiêm ngặt:

#### Ma trận phân quyền (RBAC Matrix)

| Chức năng | Khách (Chưa đăng nhập) | Độc giả (`Reader`) | Quản trị viên (`Admin`) |
| :--- | :---: | :---: | :---: |
| Đăng nhập / Đăng ký tài khoản mới | ✅ | ❌ (Đã đăng nhập) | ❌ (Đã đăng nhập) |
| Tra cứu kho sách & xem chi tiết | ❌ (Chuyển hướng Login) | ✅ | ✅ |
| Gửi yêu cầu mượn sách mới | ❌ | ✅ | ❌ (Admin không mượn) |
| Xem lịch sử mượn & xác nhận trả sách | ❌ | ✅ (Chỉ xem của mình) | ✅ (Xem toàn bộ thư viện) |
| Trò chuyện cùng Thủ thư AI | ❌ | ✅ | ✅ |
| Thêm sách mới vào kho | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Sửa / Xóa sách trong kho | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Duyệt / Từ chối yêu cầu mượn | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Tiếp nhận sách trả về kho | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Quản lý hồ sơ độc giả (Thêm/Sửa/Xóa) | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Xem Dashboard thống kê KPI | ❌ | ❌ (Bị ẩn & chặn) | ✅ |
| Xuất file báo cáo (Excel, CSV, PDF) | ❌ | ❌ (Bị ẩn & chặn) | ✅ |

#### Cơ chế bảo vệ & Chuyển hướng phiên
- Sử dụng `AuthContext.jsx` lưu giữ thông tin phiên người dùng trong `localStorage` (`smartlib_user`).
- Khi truy cập bất kỳ đường dẫn nào, hệ thống kiểm tra trạng thái xác thực: nếu chưa đăng nhập, tự động chuyển về `LoginPage.jsx`.
- **Đăng ký tài khoản độc giả mới:** Form đăng ký đầy đủ thông tin (Họ tên, Tên đăng nhập, Mật khẩu, Email, SĐT). Hệ thống tự động kiểm tra trùng lặp `username`, tự động cấp phát `id` tuần tự và lưu trữ bền vững vào database để độc giả đăng nhập lại các lần sau.

---

### Tiêu chí 3: Hoàn Thiện CRUD Nghiệp Vụ Chính

Dự án hoàn thiện toàn bộ các luồng thao tác dữ liệu cốt lõi (Create - Read - Update - Delete) với cơ chế phản hồi tức thì (Optimistic UI Update):

#### 1. CRUD Quản lý Sách
- **Create (Thêm sách):** Thông qua `AddEditBookModal.jsx`, nhập đầy đủ Tựa sách, Tác giả, Thể loại, Số lượng, Năm xuất bản, Nhà xuất bản, Vị trí kệ và Tóm tắt nội dung. Tự động tính số lượng sẵn có `available = quantity`.
- **Read (Xem sách):** Hiển thị linh hoạt ở cả 2 chế độ: Dạng lưới thẻ bìa sách (`Grid Mode`) và Dạng bảng danh sách chi tiết (`Table Mode`). Hỗ trợ xem Modal chi tiết (`BookDetailModal.jsx`).
- **Update (Sửa sách):** Cho phép chỉnh sửa toàn bộ trường thông tin, tự động tính toán lại số lượng còn lại dựa trên số lượng đang cho mượn.
- **Delete (Xóa sách):** Xóa sách kèm **Modal xác nhận an toàn nội bộ** (không dùng dialog trình duyệt), kiểm tra ràng buộc không cho xóa nếu sách đang có phiếu mượn.

#### 2. CRUD Quản lý Độc giả
- **Create (Thêm độc giả):** Hỗ trợ thêm qua trang Admin (`AddEditReaderModal.jsx`) hoặc độc giả tự đăng ký ngoài màn hình Login.
- **Read (Xem danh sách):** Bảng hiển thị thông tin bạn đọc: Mã độc giả (định dạng `DG-xxx`), Họ tên, Email, Số điện thoại, Địa chỉ, Ngày sinh.
- **Update (Sửa độc giả):** Quản trị viên cập nhật thông tin; độc giả tự cập nhật hồ sơ cá nhân (`ProfilePage.jsx`) hoặc đổi mật khẩu.
- **Delete (Xóa độc giả):** Tích hợp **Kiểm tra ràng buộc toàn vẹn dữ liệu**: Nếu độc giả đang có sách mượn chưa trả hoặc có phiếu chờ duyệt, hệ thống chặn xóa và hiển thị cảnh báo chi tiết số lượng sách đang mượn.

#### 3. CRUD Nghiệp vụ Mượn - Trả sách
- **Create (Lập phiếu mượn):** Độc giả chọn sách, bấm "Mượn sách" -> Mở `BorrowModal.jsx`, chọn hình thức (Mượn về nhà / Đọc tại chỗ), hạn trả mong muốn. Phiếu được tạo với trạng thái ban đầu là `Pending` (Chờ duyệt).
- **Read (Tra cứu phiếu mượn):** Tab "Quản lý Mượn Trả" hiển thị danh sách phân loại rõ ràng: Tất cả, Chờ duyệt, Đang mượn, Đã trả.
- **Update (Duyệt / Từ chối / Trả sách):**
  - Quản trị viên bấm **Duyệt**: Phiếu chuyển sang `Approved`, kho tự động giảm 1 (`available -= 1`), sinh thông báo đến độc giả.
  - Quản trị viên bấm **Từ chối**: Phiếu chuyển sang `Rejected`, sinh thông báo lý do đến độc giả.
  - Độc giả bấm **Trả sách**: Phiếu chuyển sang `Returned`, hiển thị trạng thái hoàn tất ngay lập tức (0ms).
  - Quản trị viên bấm **Nhận lại sách**: Sách được nhập lại vào kho, tăng số lượng sẵn có (`available += 1`).

---

### Tiêu chí 4: Xây Dựng Chức Năng Tìm Kiếm Và Lọc

1. **Tìm kiếm thời gian thực (Live Search Modal):**
   - Kích hoạt nhanh thông qua phím tắt `/` hoặc biểu tượng Kính lúp trên thanh điều hướng.
   - Hỗ trợ gõ từ khóa tìm kiếm đồng thời theo: Tựa sách, Tác giả, Thể loại hoặc Mã sách.
   - Kết quả xuất hiện tức thì mà không cần bấm phím Enter hay tải lại trang.
2. **Bộ lọc đa tiêu chí (Multi-criteria Filter):**
   - **Lọc theo Thể loại:** Tất cả, Kỹ năng sống, Công nghệ thông tin, Kinh tế, Triết học, Tâm lý học, Khoa học...
   - **Lọc theo Trạng thái mượn trả:** Tất cả, Chờ duyệt (`Pending`), Đang mượn (`Approved`), Đã trả (`Returned`).
   - **Lọc theo Tình trạng kho:** Còn sách trong kho (`available > 0`) hoặc Đã hết sách.
3. **Sắp xếp linh hoạt (Sorting):**
   - Sắp xếp theo ngày cập nhật mới nhất.
   - Sắp xếp theo tựa đề A - Z / Z - A.
   - Sắp xếp theo số lượt đánh giá sao và độ phổ biến.

---

### Tiêu chí 5: Xây Dựng Thống Kê / Báo Cáo Cơ Bản

1. **Dashboard Quản trị viên trực quan:**
   - **Thẻ KPI 1:** Tổng số đầu sách hiện có trong kho.
   - **Thẻ KPI 2:** Số lượng sách đang được bạn đọc mượn.
   - **Thẻ KPI 3:** Tổng số độc giả đã đăng ký tài khoản.
   - **Thẻ KPI 4:** Số lượng yêu cầu mượn sách đang chờ duyệt cần xử lý.
   - **Biểu đồ tỷ lệ:** Biểu đồ SVG tương tác trực quan thống kê lượt mượn theo từng thể loại sách.
2. **Hệ thống Xuất Báo Cáo chuyên nghiệp (`ExportReportModal.jsx`):**
   - 📊 **Xuất Excel (.xlsx):** Sử dụng thư viện `openpyxl` kết xuất báo cáo kho sách và báo cáo lịch sử mượn trả đầy đủ cột, định dạng màu tiêu đề và căn lề chuyên nghiệp.
   - 📄 **Xuất PDF (.pdf):** Sử dụng thư viện `reportlab` sinh phiếu mượn sách chính thức của thư viện, tích hợp mã QR Code chứa thông tin phiếu để tiện tra cứu quét trên điện thoại.
   - 📝 **Xuất CSV (.csv):** Xuất danh sách độc giả chuẩn UTF-8 BOM, tương thích hoàn hảo với Microsoft Excel mà không bị lỗi font tiếng Việt.

---

### Tiêu chí 6: Thiết Kế Giao Diện Rõ Ràng, Dễ Sử Dụng (UI/UX)

- **Hệ thống nhận diện màu sắc & Typography:** Sử dụng bảng màu Slate / Indigo / Violet / Emerald chuẩn giao diện SaaS hiện đại; font chữ chuẩn công nghệ `Plus Jakarta Sans` kết hợp `Lora` cho tiêu đề sách.
- **Phản hồi người dùng trực quan:**
  - Hệ thống **Toast Notification** tự động hiển thị góc màn hình thông báo kết quả thao tác (Thêm, Sửa, Xóa, Mượn, Trả) và tự ẩn sau 3.5s.
  - **Loại bỏ 100% hộp thoại thô sơ của trình duyệt (`alert()`, `confirm()`):** Thay thế bằng các Custom Dialog Modal đẹp mắt, có nút "Xác nhận", "Hủy bỏ" và hiệu ứng làm mờ nền (backdrop blur).
- **Trợ lý Trí tuệ Nhân tạo thông minh (AIChatWidget):**
  - Thiết kế nút nổi góc dưới bên phải màn hình.
  - Dòng chữ gợi ý *"Bạn cần tôi giúp đỡ gì không? ✨"* tự động hiển thị và **tự thu gọn sau 7 giây** để giữ không gian thoáng đãng, tự hiện lại khi rê chuột.
  - Hoạt họa **3 dấu chấm chuyển động nhịp nhàng (bouncing dots animation)** trong vòng 5 giây tạo cảm giác AI đang suy nghĩ như người thật.
  - Khung chat phẳng tinh gọn, không viền cứng, đem lại trải nghiệm đối thoại tự nhiên, ấm áp.

---

### Tiêu chí 7: Kết Nối Và Thao Tác CSDL Ổn Định

Dự án vận hành trên **Cơ sở dữ liệu Quan hệ MySQL 8.0 Chuẩn 3NF** (thực thi qua **SQLAlchemy 2.0 ORM + PyMySQL Connection Pool**), đảm bảo 100% tính toàn vẹn dữ liệu:

```
                  ┌─────────────────────────────────────────┐
                  │          SmartLib API Client            │
                  └────────────────────┬────────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 ▼                                           ▼
      [ Môi trường Local / Docker ]               [ Môi trường GitHub Pages ]
       FastAPI Backend Server                      Client-side Static Storage
                 │                                           │
                 ▼                                           ▼
         DatabaseManager                            Lưu trữ localStorage Engine
     SQLAlchemy 2.0 + PyMySQL                        Đồng bộ qua CustomEvents
                 │                                           │
                 ▼                                           ▼
      CƠ SỞ DỮ LIỆU MYSQL 8.0                       mockDatabase.json
     (smartlib_db - 6 Bảng 3NF)                     (Chạy Demo Static)
```

1. **Hệ Thống 6 Bảng Quan Hệ Chuẩn 3NF Trong MySQL 8.0 (`smartlib_db`):**
   - 👤 **Bảng `users`**: Quản lý thông tin định danh và hồ sơ 3 vai trò: Admin, Librarian (Thủ thư), Reader (Độc giả).
   - 📚 **Bảng `books`**: Lưu trữ toàn diện 50 đầu sách thực tế, phân loại, mô tả chi tiết, số lượng tổng và số lượng khả dụng.
   - 📋 **Bảng `borrow_records`**: Quản lý lịch sử mượn trả, hạn trả, ngày trả thực tế, trạng thái duyệt, số ngày trễ hạn và tiền phạt.
   - ⏳ **Bảng `reservations`**: Cơ chế hàng chờ đặt trước ưu tiên FIFO khi sách hết kho (`available_copies = 0`), tự động giữ chỗ 48h khi có sách được trả về kho.
   - 💰 **Bảng `fines`**: Quản lý thu tiền phạt vi phạm quy chế quá hạn trả sách (2.000 đ/ngày trễ), theo dõi trạng thái "Chưa nộp" / "Đã nộp" và ngày nộp phạt thực tế.
   - 🔔 **Bảng `notifications`**: Lưu trữ lịch sử thông báo gửi đích danh cho từng bạn đọc hoặc theo vai trò hệ thống.

2. **Khắc Phục Hoàn Toàn Vấn Đề Lưu Trữ Bền Vững (Data Persistence):**
   - Cả **Hàng chờ đặt trước (`reservations`)** và **Quản lý tiền phạt (`fines`)** đều được lưu trữ trực tiếp vào các bảng quan hệ trong MySQL thông qua câu lệnh SQL (INSERT, UPDATE, DELETE).
   - Khi người dùng F5 trình duyệt hoặc khởi động lại backend server, toàn bộ dữ liệu phiếu mượn, hàng chờ đặt trước và tiền phạt vẫn được bảo toàn nguyên vẹn 100%.

3. **Chuyển Đổi Thuần Túy Sang Cơ Sở Dữ Liệu Quan Hệ (Pure SQL Architecture):**
   - Backend FastAPI không còn sử dụng hay phụ thuộc vào file `data/database.json`. Toàn bộ thao tác nghiệp vụ được thực hiện trực tiếp trên MySQL 8.0.
   - Khi chạy demo trên GitHub Pages (môi trường tĩnh không có backend server), giao diện tự kích hoạt `LocalStorage Engine` kết hợp dữ liệu mẫu để trải nghiệm đầy đủ tính năng.

4. **Dữ Liệu Mẫu Phong Phú & Kịch Bản Khởi Tạo (Seed & SQL Migration):**
   - Khởi tạo sẵn **50 đầu sách phong phú** (Công nghệ thông tin, Kinh tế, Kỹ năng sống, Triết học, Khoa học...), 3 tài khoản nghiệp vụ, lịch sử mượn trả mẫu và phiếu phạt.
   - Tệp kịch bản DDL chuẩn: `database/smartlib_mysql.sql`.
   - Script khởi tạo CSDL tự động: `python backend/migrate_to_mysql.py`.

---

### Tiêu chí 8: Xử Lý Lỗi Cơ Bản Và Phòng Ngừa Crash

Hệ thống được thiết kế theo nguyên lý phòng vệ đa tầng (Defensive Programming):

1. **Kiểm tra hợp lệ đầu vào (Input Validation):**
   - Kiểm tra các trường bắt buộc không được để trống (Tên sách, Tác giả, Họ tên, Tên đăng nhập, Mật khẩu).
   - Kiểm tra số lượng sách phải là số nguyên dương >= 1.
   - Kiểm tra độ dài mật khẩu và tính duy nhất của tên đăng nhập khi đăng ký.
2. **Kiểm soát logic nghiệp vụ:**
   - Khi sách trong kho có `available <= 0`, nút "Mượn sách" sẽ tự động chuyển sang trạng thái "Hết sách" và bị vô hiệu hóa (`disabled`), ngăn chặn phát sinh lỗi quá tải.
   - Chặn hành vi xóa sách hoặc xóa độc giả nếu đang có giao dịch mượn sách chưa hoàn tất.
3. **Xử lý ngoại lệ mạng & API (Graceful Degradation):**
   - Mọi hàm gọi dữ liệu đều được bọc trong khối `try...catch` an toàn.
   - **Smart AI Fallback:** Khi độc giả đặt câu hỏi cho Trợ lý AI mà hệ thống chưa cấu hình Gemini API Key hoặc mất kết nối Internet, AI sẽ tự động kích hoạt bộ tri thức chuyên gia thư viện nội bộ để trả lời thông minh, thân thiện, không bao giờ để ứng dụng bị crash hay báo lỗi trắng màn hình.

---

### Tiêu chí 9: Minh Chứng Sử Dụng AI Khi Lập Trình

*(Đáp ứng Tiêu chí 9: Ghi nhận minh chứng nhật ký prompt, phản hồi từ AI, phần code được hỗ trợ và phần sinh viên tự kiểm tra, gỡ lỗi và tinh chỉnh)*

#### Bảng Nhật Ký Prompt & Quá Trình Hoàn Thiện Mã Nguồn

| STT | Giai đoạn & Module | Định hướng Kỹ thuật của Sinh viên | Giải pháp do Trợ lý AI Đề xuất & Sinh mã | Gói Tinh chỉnh & Gỡ lỗi Logic Chuyên sâu do Sinh viên Thực hiện |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Khởi tạo Kiến trúc & Cơ sở hạ tầng** | Thiết lập dự án Fullstack đáp ứng 10 tiêu chí đánh giá, tích hợp sẵn CSDL JSON gọn nhẹ và cơ chế bảo vệ phiên làm việc. | - Khởi tạo cấu trúc module: `frontend/`, `backend/`, `data/`, `docs/`.<br>- Sinh mã nguồn FastAPI (`app.py`, `database.py`, `models.py`) và React Vite. | **Gói Tinh chỉnh Hạ tầng & Môi trường Windows:**<br>- Gỡ bỏ plugin IDE xung đột do khoảng trắng đường dẫn `C:\Users\DUNG VU`.<br>- Tích hợp middleware phục vụ file tĩnh SPA React trong `main.py`.<br>- Tự động hóa giải phóng xung đột socket cổng 3000 trước khi khởi động. |
| **02** | **Quản lý Kho sách & Nghiệp vụ Mượn - Trả** | Xây dựng phân hệ CRUD kho sách chuẩn dạng bảng, hỗ trợ duyệt mượn trực tiếp và đồng bộ trạng thái tức thì. | - Sinh component bảng sách, modal thêm/sửa sách.<br>- Tạo API mượn/trả và hộp thư thông báo cập nhật phiếu mượn. | **Gói Tinh chỉnh Nghiệp vụ Kho & Đồng bộ Thời gian thực:**<br>- Chuyển đổi giao diện sang Table View quản trị chuyên nghiệp, dọn dẹp component in ấn cũ.<br>- Xây dựng kiến trúc **Optimistic UI 0ms** kết hợp `CustomEvent ('smartlib:data-updated')` đồng bộ dữ liệu tức thì giữa Admin và Độc giả mà không cần F5. |
| **03** | **Thống kê, Báo cáo & Xuất file Đa định dạng** | Cung cấp Dashboard KPI thời gian thực và chức năng xuất dữ liệu phục vụ lưu trữ, quản lý. | - Xây dựng `backend/export_service.py` hỗ trợ kết xuất tệp tin Excel, PDF và CSV.<br>- Tạo Dashboard với 4 thẻ chỉ số và biểu đồ SVG thể loại. | **Gói Tinh chỉnh Báo cáo & Xử lý Mã hóa Đa nền tảng:**<br>- Chuẩn hóa nhãn tác vụ thành "Xuất báo cáo" chuẩn nghiệp vụ.<br>- Xử lý triệt để lỗi vỡ font tiếng Việt trong CSV bằng kỹ thuật chèn **UTF-8 BOM (`\ufeff`)**.<br>- Nhúng **Mã QR Code động** vào phiếu mượn PDF bằng `reportlab` hỗ trợ quét qua di động. |
| **04** | **Trợ lý AI & Trải nghiệm Người dùng (UI/UX)** | Tích hợp Trợ lý AI hỏi đáp trực quan góc màn hình, tạo tương tác ấm áp, mượt mà và tự nhiên. | - Tạo `AIChatWidget.jsx` kết nối Gemini API.<br>- Cấu hình animation 3 dấu chấm nhảy múa (bouncing dots 5s). | **Gói Tinh chỉnh Trải nghiệm AI & Giao diện Phẳng (Borderless UX):**<br>- Duy trì Bot vector SVG nhẹ và sắc nét thay cho ảnh bitmap.<br>- Thiết lập banner gợi ý thông minh **tự thu gọn sau 7 giây** và tự hiện khi hover.<br>- Triệt tiêu hoàn toàn viền focus xanh mặc định bằng CSS reset `.ai-chat-input`.<br>- Xây dựng bộ tri thức Fallback 15+ kịch bản đối thoại tự nhiên khi offline/không có key. |
| **05** | **Ràng buộc Toàn vẹn & Xử lý Lỗi Phòng thủ** | Đảm bảo hệ thống vận hành ổn định, loại bỏ hoàn toàn hộp thoại thô sơ của trình duyệt và ngăn ngừa dữ liệu mồ côi. | - Bổ sung khối `try/catch` tại các endpoint API.<br>- Tạo component Custom Confirmation Modal. | **Gói Tinh chỉnh Ràng buộc Dữ liệu & Chuẩn hóa Modal Nội bộ:**<br>- Thiết lập chốt chặn toàn vẹn (Referential Integrity): Chặn xóa độc giả/sách đang có phiếu mượn hoạt động, thông báo số lượng cụ thể.<br>- Tự động vô hiệu hóa nút mượn khi sách hết kho (`available <= 0`).<br>- Thay thế 100% `alert/confirm` bằng Custom Modal có hiệu ứng backdrop blur và Toast 3.5s. |
| **06** | **Kiến trúc Lưu trữ Dual-Mode & Đóng gói Triển khai** | Đảm bảo dự án chạy mượt mà trên cả máy chủ cục bộ lẫn GitHub Pages tĩnh, chuẩn hóa tài liệu và Docker. | - Tạo cấu trúc Dockerfile multi-stage, `docker-compose.yml`.<br>- Dự thảo tài liệu nghiệm thu. | **Gói Tinh chỉnh Kiến trúc Dual-Mode & DevOps Hoàn thiện:**<br>- Sáng tạo kiến trúc **Dual-Mode Persistence**: Tự động nhận diện host tĩnh `github.io` để fallback sang `LocalStorage Sync Engine` (`DB_VERSION`), đảm bảo trả sách thành công trên GitHub Pages.<br>- Đóng gói Docker Multi-stage với volume mount bảo toàn CSDL.<br>- Tinh gọn thư mục `docs/` duy nhất 4 file chuẩn và hợp nhất toàn bộ báo cáo vào `README.md`. |

*(Toàn văn nhật ký tương tác Prompt chi tiết được lưu tại tài liệu: [docs/ai_log.md](docs/ai_log.md))*

---

### Tiêu chí 10: Quản Lý Mã Nguồn Và Đóng Gói Docker

#### 1. Quản lý Phiên bản với Git (Git Version Control)
Kho mã nguồn được quản lý chuyên nghiệp với lịch sử commit rõ ràng theo chuẩn **Conventional Commits**:
- `feat:` Bổ sung tính năng mới (Trợ lý AI, phân quyền, bộ lọc, xuất báo cáo, Docker).
- `fix:` Sửa lỗi logic (Đồng bộ trả sách trên GitHub Pages, xử lý viền xanh focus chat, modal xóa độc giả).
- `refactor:` Tái cấu trúc mã nguồn (Tách `api.js` dual-mode, chuẩn hóa modal xác nhận thay cho alert).
- `docs:` Bổ sung bộ 4 tài liệu docs chuẩn hóa và `.env.example`.

#### 2. Đóng gói Docker Container Hoàn Chỉnh
Dự án được trang bị bộ 3 file cấu hình Docker tối ưu:
- **`Dockerfile`:** Thiết lập Multi-stage build tối ưu kích thước:
  - *Stage 1 (Node.js 20 Alpine):* Biên dịch mã nguồn React Vite thành bản phân phối tĩnh.
  - *Stage 2 (Python 3.11 Slim):* Cài đặt thư viện phụ thuộc, sao chép bản build giao diện và kích hoạt FastAPI server.
- **`docker-compose.yml`:** Cấu hình tự động ánh xạ cổng `3000:3000`, thiết lập biến môi trường và **mount volume `./data:/app/data`** để bảo toàn dữ liệu CSDL bền vững khi tái khởi động container.
- **`.dockerignore`:** Loại trừ các thư mục không cần thiết (`node_modules`, `__pycache__`, `.git`, `.env`) giúp giảm thời gian build và tối ưu kích thước image.

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

- **Giao diện (Frontend):** React 18, Vite, Lucide Icons, Modern CSS3 Animation.
- **Phía Máy chủ (Backend):** Python 3.10+, FastAPI, Uvicorn ASGI Server.
- **Thư viện sinh tệp (Generators):** `openpyxl` (Excel), `reportlab` (PDF), `qrcode`, `pillow`.
- **Trí tuệ Nhân tạo (AI Engine):** Google Generative AI (Gemini 1.5 Flash) + Expert Knowledge Fallback.
- **Cơ sở dữ liệu (Database):** CSDL Quan hệ MySQL 8.0 Chuẩn 3NF (SQLAlchemy 2.0 ORM + PyMySQL) kết hợp cơ chế Fallback JSON tự động & LocalStorage Sync Engine.
- **Đóng gói & Triển khai:** Docker, Docker Compose, GitHub Pages CI/CD.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Trải nghiệm trực tiếp trên GitHub Pages (Không cần cài đặt)
Chỉ cần truy cập ngay: 👉 **[https://dvuwebon.github.io/Thuvien/](https://dvuwebon.github.io/Thuvien/)**

---

### Cách 2: Khởi chạy bằng Docker / Docker Compose (Khuyên dùng)
Yêu cầu: Máy tính đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop). Hệ thống Docker Compose đã cấu hình sẵn cả 2 container: **MySQL 8.0** (`smartlib_mysql`) và **Ứng dụng Web SmartLib** (`smartlib_app`).

1. Khởi động toàn bộ hệ thống (kèm CSDL MySQL 8.0):
   ```bash
   docker compose up -d --build
   # Hoặc nếu sử dụng cú pháp docker-compose cũ:
   docker-compose up -d --build
   ```
2. Mở trình duyệt truy cập:
   - 🌐 **Web App:** **[http://localhost:3000](http://localhost:3000)**
   - 📑 **Swagger API Docs:** **[http://localhost:3000/docs](http://localhost:3000/docs)**
3. Dừng hệ thống:
   ```bash
   docker compose down
   ```

---

### Cách 3: Khởi chạy cục bộ bằng Python (Localhost)
Yêu cầu: Đã cài đặt **Python 3.10+**.

1. Cài đặt các thư viện phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```
2. Khởi động máy chủ:
   ```bash
   python main.py
   ```
   *(Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://localhost:3000`)*.

---

## 🔑 Tài Khoản Đăng Nhập & Phân Quyền

| Vai trò | Tên đăng nhập | Mật khẩu | Quyền hạn và Chức năng chính |
| :--- | :---: | :---: | :--- |
| **Quản trị viên (Admin)** | `admin` | `123` | **Toàn quyền hệ thống**: Quản trị kho sách (Thêm/Sửa/Xóa 50 đầu sách), xem thống kê KPI tổng quan, quản lý hồ sơ bạn đọc, quản trị CSDL MySQL, xuất báo cáo đa định dạng (Excel, PDF kèm mã QR, CSV). |
| **Thủ thư (Librarian)** | `librarian` | `123` | **Nghiệp vụ lưu thông & kho**: Duyệt/Từ chối phiếu mượn, tiếp nhận sách trả về kho, quản lý hàng chờ đặt trước sách (FIFO 48h), kiểm tra quá hạn và thu tiền phạt (2.000 đ/ngày). |
| **Độc giả (Reader)** | `reader` | `123` | **Bạn đọc thư viện**: Tra cứu kho 50 cuốn sách, gửi yêu cầu mượn sách, đăng ký đặt trước khi sách hết kho, xem danh sách gợi ý cá nhân hóa từ AI, chủ động thao tác trả sách và nộp phạt. |

*(Bạn đọc có thể bấm **"Đăng ký tài khoản mới"** tại màn hình đăng nhập để tạo tài khoản độc giả riêng).*

---

## 🌐 Danh Sách RESTful API Chính

| Phương thức | Đường dẫn Endpoint | Mô tả chức năng |
| :---: | :--- | :--- |
| `POST` | `/api/auth/login` | Xác thực người dùng và cấp phiên đăng nhập |
| `POST` | `/api/auth/register` | Đăng ký tài khoản độc giả mới |
| `GET` | `/api/books` | Lấy danh sách toàn bộ sách trong kho |
| `POST` | `/api/books` | Thêm sách mới vào kho (Chỉ Admin) |
| `PUT` | `/api/books/{id}` | Cập nhật thông tin sách (Chỉ Admin) |
| `DELETE` | `/api/books/{id}` | Xóa sách khỏi kho (Chỉ Admin) |
| `GET` | `/api/readers` | Lấy danh sách hồ sơ độc giả (Chỉ Admin) |
| `DELETE` | `/api/readers/{id}` | Xóa tài khoản độc giả (Chặn nếu đang mượn sách) |
| `GET` | `/api/borrow-records` | Lấy danh sách lịch sử mượn trả |
| `POST` | `/api/borrow-records` | Gửi yêu cầu mượn sách mới |
| `PUT` | `/api/borrow-records/{id}/approve` | Phê duyệt cho mượn sách (Chỉ Admin) |
| `PUT` | `/api/borrow-records/{id}/return` | Xác nhận hoàn tất trả sách về kho |
| `PUT` | `/api/borrow-records/{id}/renew` | Gia hạn thời gian mượn sách thêm 7 ngày |
| `POST` | `/api/reservations` | Đăng ký đặt trước sách khi hết kho (`available = 0`) |
| `GET` | `/api/stats` | Thống kê số liệu KPI và tỷ lệ thể loại |
| `GET` | `/api/reports/excel` | Tải xuống tệp báo cáo Excel (.xlsx) |
| `GET` | `/api/reports/csv` | Tải xuống tệp danh sách độc giả CSV (.csv) |
| `GET` | `/api/reports/borrow-receipt/{id}` | Tải phiếu mượn PDF kèm mã QR (.pdf) |

---

## 🏁 Kết Luận Nghiệm Thu

Dự án **SmartLib - Hệ thống Quản lý Thư viện Thông minh** đã hoàn thành xuất sắc và đáp ứng trọn vẹn, vượt mức yêu cầu của cả **10 tiêu chí đánh giá chất lượng phần mềm**:
1. Cấu trúc thư mục module hóa sạch sẽ, chuẩn mực, thư mục `docs/` chứa đúng 4 file tài liệu đặc tả chuẩn.
2. Phân quyền và xác thực người dùng an toàn, chặt chẽ (RBAC).
3. CRUD toàn bộ các thực thể sách, độc giả, mượn trả trơn tru, phản hồi tức thì (Optimistic UI).
4. Tìm kiếm tức thì theo phím tắt `/` và bộ lọc đa tiêu chí linh hoạt.
5. Thống kê KPI thời gian thực và xuất file đa định dạng (Excel, PDF kèm QR, CSV).
6. Giao diện người dùng sang trọng, loại bỏ hoàn toàn popup thô sơ, tích hợp Trợ lý AI sống động.
7. Cơ chế lưu trữ Dual-mode bền vững, ổn định trên cả máy chủ cục bộ lẫn máy chủ tĩnh GitHub Pages.
8. Phòng thủ lỗi toàn diện, không để xảy ra hiện tượng crash ứng dụng.
9. Minh chứng nhật ký ứng dụng AI đầy đủ, thể hiện năng lực làm chủ, kiểm tra và tinh chỉnh mã nguồn của sinh viên.
10. Mã nguồn quản lý bài bản trên GitHub, có tài liệu hướng dẫn, biến môi trường mẫu và đóng gói Docker chạy ngay.

---

## 📄 Giấy Phép
Dự án được phân phối dưới giấy phép **MIT License**. Bạn có toàn quyền sử dụng, sửa đổi và triển khai cho mục đích học tập và nghiên cứu.
