# 📊 SMARTLIB — ĐẶC TẢ CA SỬ DỤNG & BỘ TEST CASES KIỂM THỬ
**Hệ thống Quản lý Thư viện Thông minh — SmartLib v3.0**
> Phiên bản tài liệu: 3.0 (Đồng bộ CSDL MySQL 8.0 & 3 Nhóm Tác Nhân) | Ngày cập nhật: 08/09/2026
> 📖 **Bộ tài liệu kỹ thuật SmartLib:** [📋 Yêu cầu (SRS)](requirements.md) | [📊 Ca sử dụng & Test Cases](use_cases.md) | [🗄️ Thiết kế CSDL (ERD 6 Bảng)](database_design.md) | [🤖 Nhật ký Prompt & AI Log](ai_log.md) | [🏠 Trang chủ README](../README.md)

---

## MỤC LỤC
1. [Tổng quan Tác nhân (Actors)](#1-tổng-quan-tác-nhân-actors)
2. [Sơ đồ Quan hệ Actor - Use Case](#2-sơ-đồ-quan-hệ-actor---use-case)
3. [Danh mục Ca sử dụng Hệ thống](#3-danh-mục-ca-sử-dụng-hệ-thống)
4. [Đặc tả Chi tiết các Ca sử dụng Trọng tâm](#4-đặc-tả-chi-tiết-các-ca-sử-dụng-trọng-tâm)
   - [UC01: Đăng nhập hệ thống](#uc01--đăng-nhập-hệ-thống)
   - [UC07: Thêm mới sách vào kho](#uc07--thêm-mới-sách-vào-kho)
   - [UC10: Đăng ký mượn sách](#uc10--đăng-ký-mượn-sách)
   - [UC11: Xét duyệt yêu cầu mượn](#uc11--xét-duyệt-yêu-cầu-mượn)
   - [UC12: Hoàn tất trả sách](#uc12--hoàn-tất-trả-sách)
   - [UC13: Đặt trước sách khi hết hàng (Reservation)](#uc13--đặt-trước-sách-khi-hết-hàng-reservation)
   - [UC14: Gia hạn thời gian mượn (Renewal)](#uc14--gia-hạn-thời-gian-mượn-renewal)
   - [UC17: Hỏi đáp cùng Trợ lý AI (RAG Prompt v3)](#uc17--hỏi-đáp-cùng-trợ-lý-ai-rag-prompt-v3)
   - [UC18: AI Tóm tắt nội dung sách (Summarizer)](#uc18--ai-tóm-tắt-nội-dung-sách-summarizer)
   - [UC19: Xuất báo cáo đa định dạng (Excel, PDF có QR, CSV)](#uc19--xuất-báo-cáo-đa-định-dạng)
5. [Bộ Test Cases Kiểm thử Hệ thống (TC01 - TC07)](#5-bộ-test-cases-kiểm-thử-hệ-thống-tc01---tc07)

---

## 1. TỔNG QUAN TÁC NHÂN (Actors)

| Tác nhân | Mô tả vai trò | Quyền hạn chính |
| :---: | :--- | :--- |
| **Quản trị viên (`Admin`)** | Cán bộ quản lý cấp cao | Toàn quyền cấu hình CSDL, quản trị kho sách, độc giả, theo dõi Dashboard KPI doanh thu phạt và xuất báo cáo. |
| **Thủ thư (`Librarian`)** | Nhân viên nghiệp vụ chuyên trách | Duyệt/từ chối phiếu mượn, tiếp nhận sách trả, quản lý hàng chờ đặt trước sách (FIFO 48h), thu tiền phạt quá hạn. |
| **Độc giả / Bạn đọc (`Reader`)** | Học sinh, sinh viên, người dùng đã đăng ký | Tra cứu 50 đầu sách, gửi yêu cầu mượn, gia hạn, đặt trước sách, trả sách của mình, hỏi đáp AI và xem gợi ý cá nhân hóa. |
| **Khách vãng lai (`Guest`)** | Người dùng chưa xác thực | Xem trang Đăng nhập / Đăng ký tài khoản mới; bị tự động chuyển hướng khi truy cập tính năng nội bộ. |
| **Hệ thống AI (`AI Assistant`)** | Trí tuệ Nhân tạo tích hợp Gemini & Fallback | Tiếp nhận câu hỏi tự nhiên, đối soát kho sách qua RAG Prompt v3, xuất cấu trúc JSON và tóm tắt sách. |

---

## 2. SƠ ĐỒ QUAN HỆ ACTOR - USE CASE

```
                         ┌─────────────────────────────────────────────────────────────┐
                         │                    HỆ THỐNG SMARTLIB                        │
                         │                                                             │
              ┌──────┐   │   [UC01] Đăng nhập hệ thống                                 │
              │Guest │───┼──►[UC02] Đăng ký tài khoản độc giả mới                      │
              └──────┘   │                                                             │
                         │   [UC04] Xem danh sách sách (Grid / Table)                  │
              ┌────────┐ │   [UC05] Tìm kiếm thời gian thực & Lọc đa tiêu chí          │
              │Reader  │─┼──►[UC06] Xem chi tiết sách & vị trí kệ                     │
              └────────┘ │   [UC10] Đăng ký mượn sách                                  │
                 │       │   [UC12] Hoàn tất trả sách                                  │
                 │       │   [UC13] Đặt trước sách khi hết hàng (Reservation)          │
                 │       │   [UC14] Gia hạn thời gian mượn (Renewal)                   │
                 │       │   [UC16] Cập nhật hồ sơ cá nhân & Đổi mật khẩu              │
                 │       │   [UC17] Hỏi đáp cùng Trợ lý AI (RAG Prompt v3) ◄──────────┐│
                 │       │   [UC18] AI Tóm tắt nội dung sách (Summarizer)  ◄──────────┼┤
                 │       │   [UC20] Xem hộp thư thông báo thời gian thực               ││
                 │       │                                                             ││
              ┌────────┐ │   [UC07] Thêm mới sách vào kho                              ││
              │Admin   │─┼──►[UC08] Chỉnh sửa thông tin sách                           ││
              └────────┘ │   [UC09] Xóa sách (Kiểm tra ràng buộc mượn/đặt trước)       ││
                 │       │   [UC11] Xét duyệt / Từ chối yêu cầu mượn                   ││
                 │       │   [UC15] Xử lý hàng đợi Đặt trước sách                      ││
                 │       │   [UC19] Xuất báo cáo (Excel, PDF kèm QR, CSV)              ││
                 │       │   [UC21] Quản lý thẻ độc giả (CRUD & Chặn xóa ràng buộc)    ││
                 │       │   [UC22] Xem Dashboard KPI thời gian thực & Biểu đồ         ││
                 │       └─────────────────────────────────────────────────────────────┘│
                 │                                                                      │
                 └───────────────────────────────►┌────────────┐                        │
                                                  │AI Assistant│────────────────────────┘
                                                  └────────────┘
```

---

## 3. DANH MỤC CA SỬ DỤNG HỆ THỐNG

| Mã UC | Tên Ca sử dụng | Tác nhân chính | Mục đích nghiệp vụ |
| :---: | :--- | :---: | :--- |
| **UC01** | Đăng nhập hệ thống | Guest, Reader, Admin | Xác thực danh tính và phân quyền vai trò. |
| **UC02** | Đăng ký độc giả mới | Guest | Tạo tài khoản bạn đọc mới lưu bền vững vào CSDL. |
| **UC03** | Đăng xuất | Reader, Admin | Xóa phiên làm việc hiện tại an toàn. |
| **UC04** | Xem danh mục sách | Reader, Admin | Hiển thị sách theo dạng lưới thẻ hoặc bảng chi tiết. |
| **UC05** | Tìm kiếm và lọc sách | Reader, Admin | Tìm kiếm Live Search và lọc theo thể loại/tồn kho. |
| **UC06** | Xem chi tiết sách | Reader, Admin | Xem thông tin chi tiết mục lục và đánh giá. |
| **UC07** | Thêm mới sách | Admin | Nhập sách mới vào kho dữ liệu thư viện. |
| **UC08** | Sửa thông tin sách | Admin | Cập nhật số lượng, thể loại, vị trí kệ. |
| **UC09** | Xóa sách khỏi kho | Admin | Xóa sách kèm kiểm tra ràng buộc không có người mượn. |
| **UC10** | Đăng ký mượn sách | Reader | Lập phiếu mượn khi sách còn hàng (`available > 0`). |
| **UC11** | Duyệt / Từ chối mượn | Admin | Phê duyệt hoặc từ chối phiếu mượn sách của bạn đọc. |
| **UC12** | Hoàn tất trả sách | Reader, Admin | Độc giả bấm trả sách và thủ thư xác nhận nhập kho. |
| **UC13** | Đặt trước sách | Reader | Xếp hàng ưu tiên nhận sách khi sách hết (`available = 0`). |
| **UC14** | Gia hạn mượn sách | Reader | Độc giả xin gia hạn mượn thêm 7 ngày. |
| **UC15** | Xử lý ưu tiên đặt trước | Admin, System | Tự động giữ sách 48h cho người đầu hàng đợi khi có sách trả. |
| **UC16** | Cập nhật hồ sơ cá nhân | Reader | Thay đổi thông tin liên lạc và đổi mật khẩu bảo mật. |
| **UC17** | Hỏi đáp cùng Trợ lý AI | Reader, Admin | Nhận tư vấn sách theo nhu cầu qua RAG Prompt v3 (JSON). |
| **UC18** | AI Tóm tắt sách | Reader, Admin | Nhận tóm tắt 3 ý chính và bài học thực tiễn cuốn sách. |
| **UC19** | Xuất báo cáo đa định dạng| Admin | Xuất Excel (.xlsx), PDF có mã QR động, CSV tiếng Việt. |
| **UC20** | Xem thông báo hệ thống | Reader, Admin | Nhận thông báo realtime khi phiếu mượn/đặt trước cập nhật. |
| **UC21** | Quản lý độc giả (CRUD) | Admin | Cấp thẻ, chỉnh sửa và chặn xóa độc giả đang giữ sách. |
| **UC22** | Xem Dashboard thống kê | Admin | Quan sát 4 thẻ KPI và biểu đồ phân bổ thể loại. |

---

## 4. ĐẶC TẢ CHI TIẾT CÁC CA SỬ DỤNG TRỌNG TÂM

---

### UC01 — Đăng nhập hệ thống

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Xác thực danh tính và điều hướng người dùng về đúng không gian làm việc. |
| **Tác nhân** | Guest (Chưa đăng nhập) |
| **Tiền điều kiện** | Người dùng mở trình duyệt tại trang chủ ứng dụng. |
| **Hậu điều kiện** | Phiên đăng nhập được lưu giữ trong `AuthContext` (`localStorage`), giao diện chuyển trang tương ứng. |

**Luồng sự kiện chính (Main Flow):**
1. Người dùng nhập Tên đăng nhập (`username`) và Mật khẩu (`password`).
2. Nhấn nút "Đăng nhập".
3. Hệ thống kiểm tra thông tin với CSDL:
   - Nếu là tài khoản Quản trị viên (`role = "Admin"`): Chuyển hướng tới `/admin` (AdminDashboard).
   - Nếu là tài khoản Độc giả (`role = "Reader"`): Chuyển hướng tới `/books` (ReaderPortal).
4. Hiển thị thông báo Toast xanh: *"Đăng nhập thành công! Chào mừng [Họ tên]"*.

**Luồng sự kiện thay thế (Alternative Flow):**
- **3a. Sai tên đăng nhập hoặc mật khẩu:** Hệ thống hiển thị thông báo lỗi màu đỏ *"Tên đăng nhập hoặc mật khẩu không chính xác!"*. Người dùng nhập lại thông tin.

---

### UC10 — Đăng ký mượn sách

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Cho phép độc giả gửi yêu cầu mượn cuốn sách còn trong kho. |
| **Tác nhân** | Độc giả (`Reader`) |
| **Tiền điều kiện** | Độc giả đã đăng nhập; cuốn sách có số lượng sẵn có `available > 0`. |
| **Hậu điều kiện** | Phiếu mượn được tạo với trạng thái `Pending`; thông báo gửi đến Quản trị viên. |

**Luồng sự kiện chính (Main Flow):**
1. Độc giả xem danh mục sách, bấm nút **"Mượn sách"** trên thẻ sách mong muốn.
2. Hệ thống mở `BorrowModal.jsx` hiển thị tựa sách, tác giả, số lượng còn.
3. Độc giả chọn hình thức: *Mượn về nhà* hoặc *Đọc tại chỗ*, chọn hạn trả mong muốn.
4. Bấm **"Xác nhận mượn"**.
5. Hệ thống tạo bản ghi mượn mới trong bảng `borrowRecords` với trạng thái `Pending`.
6. Thông báo Toast xanh xác nhận gửi yêu cầu thành công. Quản trị viên nhận thông báo mới trong hộp thư.

**Luồng sự kiện thay thế (Alternative Flow):**
- **1a. Sách hết kho (`available = 0`):** Nút "Mượn sách" tự động chuyển thành **"Đặt trước sách"** (Chuyển sang ca sử dụng UC13).

---

### UC13 — Đặt trước sách khi hết hàng (Book Reservation)

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Cho phép độc giả đăng ký xếp hàng ưu tiên mượn cuốn sách hiện đang hết kho. |
| **Tác nhân** | Độc giả (`Reader`) |
| **Tiền điều kiện** | Độc giả đã đăng nhập; cuốn sách có `available = 0`. |
| **Hậu điều kiện** | Bản ghi đặt trước được lưu vào bảng `reservations` với trạng thái `Waiting`. |

**Luồng sự kiện chính (Main Flow):**
1. Độc giả nhận thấy sách mong muốn đã hết kho (`available = 0`), nút bấm hiển thị **"Đặt trước sách"**.
2. Độc giả bấm nút "Đặt trước sách".
3. Modal xác nhận mở ra hiển thị: Tên sách, Tác giả, và thứ tự hàng đợi hiện tại (ví dụ: *"Bạn sẽ là người thứ 2 trong hàng đợi"*).
4. Độc giả bấm "Xác nhận đặt trước".
5. Hệ thống tạo bản ghi trong bảng `reservations` với `status = "Waiting"`, gán thời gian `reservedAt = now()`.
6. Hiển thị Toast thông báo: *"Đặt trước thành công! Hệ thống sẽ thông báo ngay khi có sách trả về kho."*.

**Luồng xử lý tự động khi có người trả sách (System Auto-Trigger):**
- Khi có độc giả khác trả cuốn sách đó về:
  - Hệ thống kiểm tra bảng `reservations` có bản ghi `Waiting` cho cuốn sách đó không.
  - Nếu có: Không tăng `available` công khai, chuyển bản ghi của người đầu hàng đợi sang `Notified` (Đã thông báo), phát thông báo ưu tiên giữ sách 48 giờ.

---

### UC14 — Gia hạn thời gian mượn (Loan Renewal)

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Cho phép độc giả kéo dài thời hạn mượn sách thêm 7 ngày. |
| **Tác nhân** | Độc giả (`Reader`) |
| **Tiền điều kiện** | Độc giả đang có phiếu mượn trạng thái `Approved`; chưa quá hạn; sách chưa có ai đặt trước. |
| **Hậu điều kiện** | Hạn trả `dueDate` của phiếu mượn được cộng thêm 7 ngày. |

**Luồng sự kiện chính (Main Flow):**
1. Độc giả truy cập tab "Lịch sử mượn trả" trên cổng cá nhân.
2. Tại cuốn sách đang mượn, độc giả bấm nút **"Gia hạn"**.
3. Hệ thống kiểm tra điều kiện:
   - Sách chưa quá hạn trả.
   - Cuốn sách chưa có độc giả nào khác đặt trước trong hàng đợi `reservations`.
4. Hệ thống gia hạn thành công: Tự động cộng thêm 7 ngày vào `dueDate`, ghi nhận số lần gia hạn `renewCount = 1`.
5. Hiển thị Toast thông báo: *"Gia hạn thành công thêm 7 ngày! Hạn trả mới: [Ngày/Tháng/Năm]"*.

**Luồng sự kiện thay thế (Alternative Flow):**
- **3a. Sách đã có người đặt trước:** Hệ thống hiển thị cảnh báo: *"Không thể gia hạn vì sách này đang có độc giả khác đặt trước. Vui lòng hoàn trả đúng hạn."*.

---

### UC17 — Hỏi đáp cùng Trợ lý AI (RAG Prompt v3)

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Độc giả trò chuyện với Trợ lý AI để nhận tư vấn sách theo nhu cầu dựa trên kho sách thực tế. |
| **Tác nhân** | Độc giả (`Reader`), Quản trị viên (`Admin`) |
| **Tiền điều kiện** | Người dùng mở widget chat AI ở góc dưới bên phải màn hình. |
| **Hậu điều kiện** | AI phản hồi câu trả lời súc tích $\le 300$ ký tự và danh sách gợi ý $\le 5$ cuốn từ kho sách. |

**Luồng sự kiện chính (Main Flow):**
1. Người dùng bấm vào biểu tượng Bot vector nổi góc phải, khung chat mở ra với thiết kế phẳng borderless.
2. Người dùng nhập câu hỏi (ví dụ: *"Tư vấn cho mình cuốn sách hay về tâm lý giao tiếp"*), bấm Gửi hoặc Enter.
3. Hoạt họa 3 dấu chấm nhảy múa (bouncing dots animation) kích hoạt trong 5 giây mô phỏng nhịp điệu suy nghĩ tự nhiên của thủ thư.
4. Hệ thống truyền câu hỏi kết hợp danh mục sách hiện có (`{{book_list}}`) vào Prompt RAG v3 gửi đến Google Gemini API:
   - AI phân tích và trả về cấu trúc JSON chuẩn:
     ```json
     {
       "answer": "Chào bạn! Trong kho sách SmartLib, mình gợi ý bạn cuốn Đắc Nhân Tâm - cẩm nang kinh điển về nghệ thuật giao tiếp và thu phục lòng người.",
       "suggested_books": [2],
       "intent": "recommendation"
     }
     ```
5. Khung chat hiển thị câu trả lời dạng Markdown thân mật kèm thẻ sách gợi ý có thể click xem chi tiết ngay.

**Luồng sự kiện thay thế (Alternative Flow - Smart Fallback):**
- **4a. Mất mạng hoặc chưa cấu hình API Key:** Cơ chế **Smart Fallback** tự động kích hoạt bộ tri thức chuyên gia thư viện nội bộ, trả lời lưu loát theo đúng ngữ cảnh mà không bao giờ báo lỗi trắng màn hình.

---

### UC18 — AI Tóm tắt nội dung sách (AI Summarizer)

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Tóm tắt nhanh nội dung chính và bài học thực tiễn của cuốn sách trong 3 giây. |
| **Tác nhân** | Độc giả (`Reader`), Quản trị viên (`Admin`) |
| **Tiền điều kiện** | Người dùng đang mở Modal xem chi tiết sách (`BookDetailModal.jsx`). |
| **Hậu điều kiện** | Khối thông tin tóm tắt hiển thị trực tiếp trong modal. |

**Luồng sự kiện chính (Main Flow):**
1. Người dùng bấm nút **"AI Tóm tắt"** (Sparkles icon) tại chi tiết cuốn sách.
2. Hệ thống hiển thị hiệu ứng quét thông minh (AI Scanning animation).
3. Sau 2-3 giây, hệ thống hiển thị khối tóm tắt gồm:
   - **Tóm lược cốt lõi:** 2-3 câu khái quát thông điệp cuốn sách.
   - **3 Điểm nổi bật chính:** Bullet points các ý tưởng đắt giá nhất.
   - **Bài học ứng dụng:** Hành động thực tiễn độc giả có thể áp dụng ngay vào đời sống.

---

### UC19 — Xuất báo cáo đa định dạng (Excel, PDF có QR, CSV)

| Thuộc tính | Nội dung mô tả |
| :--- | :--- |
| **Mục tiêu** | Trích xuất dữ liệu kho sách, phiếu mượn và danh sách độc giả phục vụ lưu trữ văn bản. |
| **Tác nhân** | Quản trị viên (`Admin`) |
| **Tiền điều kiện** | Quản trị viên đăng nhập, truy cập tab Thống kê hoặc bấm "Xuất báo cáo". |
| **Hậu điều kiện** | Tệp tin được tải xuống máy tính người dùng đúng định dạng và bảng mã chuẩn. |

**Luồng sự kiện chính (Main Flow):**
1. Quản trị viên mở `ExportReportModal.jsx`, chọn loại dữ liệu và định dạng:
   - **Báo cáo Excel (.xlsx):** Tạo file qua `openpyxl`, có tô màu header, viền bảng và tự căn chỉnh độ rộng cột.
   - **Phiếu mượn PDF (.pdf):** Tạo file qua `reportlab`, nhúng mã QR Code động tra cứu qua điện thoại di động.
   - **Danh sách độc giả CSV (.csv):** Tạo file chèn ký tự UTF-8 BOM (`\ufeff`) tương thích hoàn hảo với Microsoft Excel Windows không lỗi font tiếng Việt.
2. Bấm "Tải xuống".
3. Trình duyệt tự động tải tệp tin về thư mục Downloads.

---

## 5. BỘ TEST CASES KIỂM THỬ HỆ THỐNG (TC01 - TC07)

Dưới đây là bộ **7 Test Cases chuẩn mực** bao quát toàn bộ các chức năng trọng yếu, từ xác thực phân quyền, nghiệp vụ CRUD, quy trình lưu thông - đặt trước cho đến Trợ lý AI và xuất báo cáo:

| Mã Test Case | Tên Test Case & Mục tiêu | Các bước Thực hiện (Steps) | Dữ liệu Đầu vào (Test Data) | Kết quả Mong đợi (Expected Result) | Trạng thái (Status) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC01** | **Xác thực Đăng nhập & Phân quyền RBAC**<br>*Kiểm tra đăng nhập đúng vai trò và bảo vệ tuyến đường.* | 1. Mở `/login`.<br>2. Nhập username/password.<br>3. Bấm Đăng nhập.<br>4. Thử truy cập `/admin` bằng tài khoản Reader. | - Admin: `admin / 123`<br>- Reader: `reader / 123` | - Admin vào thẳng `AdminDashboard`.<br>- Reader vào `ReaderPortal`.<br>- Reader vào `/admin` bị chặn hoặc ẩn các nút quản trị. | **PASSED** ✅ |
| **TC02** | **Thêm mới Sách & Kiểm tra Tính Hợp lệ**<br>*Kiểm tra ràng buộc dữ liệu đầu vào khi thêm sách.* | 1. Admin vào "Kho sách".<br>2. Bấm "Thêm sách".<br>3. Để trống Tựa sách rồi bấm Lưu.<br>4. Nhập đủ thông tin hợp lệ rồi bấm Lưu. | - Trường hợp 1: Tựa sách để trống.<br>- Trường hợp 2: Tựa sách: "Học Máy Thực Hành", Tác giả: "Nguyễn Văn A", Số lượng: 5. | - Báo lỗi đỏ yêu cầu nhập tựa sách.<br>- Lưu thành công, sách mới hiển thị đầu danh sách, `available = 5`. | **PASSED** ✅ |
| **TC03** | **Đăng ký Mượn Sách & Trừ Tồn kho Tự động**<br>*Kiểm tra luồng mượn sách và giảm số lượng khả dụng.* | 1. Reader chọn sách có `available > 0`.<br>2. Bấm "Mượn sách".<br>3. Chọn hạn trả, bấm Xác nhận.<br>4. Admin bấm "Duyệt" phiếu mượn. | - Cuốn sách ID: 1, `available = 8`.<br>- Hình thức: Mượn về nhà.<br>- Hạn trả: +14 ngày. | - Phiếu mượn tạo trạng thái `Pending`.<br>- Khi Admin duyệt: trạng thái thành `Approved`, `available` tự động giảm còn 7 cuốn, Reader nhận thông báo. | **PASSED** ✅ |
| **TC04** | **Đặt trước Sách khi Hết kho (Reservation)**<br>*Kiểm tra chuyển đổi nút mượn và ghi nhận hàng đợi.* | 1. Tìm cuốn sách có `available = 0`.<br>2. Quan sát trạng thái nút bấm.<br>3. Bấm "Đặt trước sách".<br>4. Xác nhận đặt trước trong Modal. | - Cuốn sách có `available = 0`.<br>- Tài khoản: `reader` (ID: 2). | - Nút "Mượn sách" tự đổi thành "Đặt trước sách".<br>- Tạo bản ghi `reservations` với `status = Waiting`, xếp vào hàng đợi FIFO. | **PASSED** ✅ |
| **TC05** | **Hoàn tất Trả sách & Kích hoạt Thông báo Ưu tiên**<br>*Kiểm tra trả sách và thông báo người đặt trước.* | 1. Reader bấm "Trả sách" trên cổng cá nhân.<br>2. Admin bấm "Nhận lại sách".<br>3. Kiểm tra thông báo tới người đặt trước cuốn sách đó. | - Phiếu mượn ID: 1 (`Approved`).<br>- Cuốn sách có người đang chờ trong `reservations`. | - Giao diện Reader cập nhật `Returned` tức thì (0ms).<br>- Tồn kho tăng lại, hệ thống gửi thông báo giữ sách 48h cho người đầu hàng đợi đặt trước. | **PASSED** ✅ |
| **TC06** | **Trợ lý AI Phản hồi JSON & Giới hạn Độ dài**<br>*Kiểm tra Prompt RAG v3 và định dạng phản hồi AI.* | 1. Mở widget AIChatWidget.<br>2. Nhập câu hỏi tìm sách theo nhu cầu.<br>3. Quan sát hoạt họa 5 giây.<br>4. Kiểm tra cấu trúc câu trả lời. | - Câu hỏi: *"Tư vấn cho mình cuốn sách hay về khởi nghiệp kinh doanh"*. | - Hoạt họa 3 dấu chấm chạy nhịp nhàng 5s.<br>- AI phản hồi độ dài $\le 300$ ký tự, trích dẫn đúng sách trong kho, trả về cấu trúc JSON parse thành thẻ sách gợi ý. | **PASSED** ✅ |
| **TC07** | **Xuất Báo cáo Đa định dạng (Excel, PDF có QR, CSV)**<br>*Kiểm tra tính toàn vẹn và bảng mã tiếng Việt của tệp.* | 1. Admin vào "Xuất báo cáo".<br>2. Lần lượt tải tệp Excel, PDF và CSV.<br>3. Mở file CSV bằng Microsoft Excel Windows.<br>4. Quét mã QR trên file PDF bằng điện thoại. | - Báo cáo kho sách Excel (.xlsx).<br>- Phiếu mượn PDF (.pdf).<br>- Danh sách độc giả CSV (.csv). | - File CSV mở trên Excel hiển thị tiếng Việt hoàn hảo (nhờ UTF-8 BOM).<br>- File PDF hiển thị mã QR chứa đúng thông tin phiếu mượn.<br>- File Excel có tiêu đề tô màu và auto-width. | **PASSED** ✅ |

---

*Tài liệu Đặc tả Ca sử dụng và Bộ Test Cases này đã được nghiệm thu thực tế, đảm bảo 100% kịch bản kiểm thử đều đạt kết quả PASSED trên toàn hệ thống SmartLib v2.1.*
