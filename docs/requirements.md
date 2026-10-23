# 📋 SMARTLIB — ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
**Hệ thống Quản lý Thư viện Thông minh Tích hợp Trợ lý AI & Đặt Trước Sách**
> Phiên bản tài liệu: 2.1 (Đồng bộ Báo cáo Kỹ thuật) | Ngày cập nhật: 04/09/2026
> 📖 **Bộ tài liệu kỹ thuật SmartLib:** [📋 Yêu cầu (SRS)](requirements.md) | [📊 Ca sử dụng & Test Cases](use_cases.md) | [🗄️ Thiết kế CSDL (ERD 7 Bảng)](database_design.md) | [🤖 Nhật ký Prompt & AI Log](ai_log.md) | [🏠 Trang chủ README](../README.md)

---

## MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Quy trình nghiệp vụ cốt lõi](#2-quy-trình-nghiệp-vụ-cốt-lõi)
3. [Yêu cầu chức năng chi tiết (Bảng F01 - F38)](#3-yêu-cầu-chức-năng-chi-tiết)
4. [Yêu cầu phi chức năng (Non-Functional Requirements)](#4-yêu-cầu-phi-chức-năng)
5. [Ràng buộc hệ thống & Toàn vẹn dữ liệu](#5-ràng-buộc-hệ-thống--toàn-vẹn-dữ-liệu)
6. [Môi trường hoạt động và Triển khai đa nền tảng](#6-môi-trường-hoạt-động-và-triển-khai-đa-nền-tảng)

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1. Mục tiêu hệ thống
SmartLib là hệ thống phần mềm quản lý và tra cứu thư viện hiện đại kết hợp Trợ lý Trí tuệ Nhân tạo (AI Library Assistant). Hệ thống giải quyết trọn vẹn bài toán vận hành thư viện trường học/tổ chức:
- **Tối ưu hóa quản trị kho sách:** Số hóa toàn diện danh mục, quản lý vị trí kệ, theo dõi số lượng tồn khả dụng thời gian thực.
- **Tự động hóa chu trình lưu thông (Circulation):** Mượn sách, trả sách, gia hạn thời gian mượn và **hàng đợi đặt trước sách (Reservation Queue)** khi sách tạm thời hết kho.
- **Trợ lý AI thông minh (RAG-based AI Assistant):** Hỗ trợ bạn đọc tra cứu sách theo nhu cầu, tóm tắt nội dung sách tức thì và giải đáp thắc mắc 24/7.
- **Báo cáo & Chứng từ số hóa:** Xuất báo cáo Excel chuyên nghiệp, danh sách CSV chuẩn font tiếng Việt và phiếu mượn PDF trang trọng tích hợp mã QR Code tra cứu nhanh.

### 1.2. Các bên liên quan (Stakeholders)
| Đối tượng | Trách nhiệm & Quyền hạn |
| :--- | :--- |
| **Quản trị viên / Thủ thư (Admin / Librarian)** | Quản trị kho sách (CRUD), phê duyệt phiếu mượn/trả/đặt trước, quản lý bạn đọc, xử lý phạt và xuất báo cáo. |
| **Độc giả / Bạn đọc (Reader)** | Tìm kiếm, xem mục lục, mượn sách, gia hạn, đặt trước sách, nhờ AI tóm tắt và quản lý lịch sử cá nhân. |
| **Trợ lý AI (AI Assistant)** | Phân tích câu hỏi tự nhiên, đối soát kho sách qua kỹ thuật RAG và sinh phản hồi định dạng JSON chuẩn. |

---

## 2. QUY TRÌNH NGHIỆP VỤ CỐT LÕI

### 2.1. Quy trình Mượn - Trả sách thông thường
1. Độc giả tra cứu sách trên hệ thống. Nếu sách còn tồn (`available > 0`), độc giả chọn hình thức (Mượn về / Đọc tại chỗ) và hạn trả mong muốn.
2. Hệ thống tạo phiếu mượn với trạng thái `Pending` (Chờ duyệt).
3. Thủ thư kiểm tra và duyệt yêu cầu (`Approved`): Hệ thống tự động giảm số lượng sẵn có (`available -= 1`), sinh thông báo tới độc giả.
4. Khi độc giả mang trả sách, thủ thư xác nhận nhập kho (`Returned`): Sách được hoàn trả tồn kho (`available += 1`). Nếu trả quá hạn, hệ thống tự động tính toán phí phạt (`fines`).

### 2.2. Quy trình Đặt trước sách (Book Reservation Queue)
1. Khi một đầu sách có số lượng sẵn có bằng 0 (`available = 0`), nút "Mượn sách" tự động chuyển thành **"Đặt trước sách"**.
2. Độc giả gửi yêu cầu đặt trước: Hệ thống ghi nhận vào bảng `reservations` với trạng thái `Waiting`, sắp xếp theo thứ tự ưu tiên thời gian (FIFO Priority Queue).
3. Khi có độc giả khác trả cuốn sách đó về kho:
   - Hệ thống không tăng ngay `available` cho công chúng mượn tự do mà tự động quét hàng đợi đặt trước.
   - Chuyển trạng thái yêu cầu đặt trước của người đầu hàng đợi sang `Notified` (Đã thông báo), phát thông báo ưu tiên giữ sách trong vòng 48 giờ.
   - Nếu quá 48 giờ độc giả không đến nhận, quyền mượn tự động chuyển tiếp cho người tiếp theo trong hàng đợi hoặc trả về kho chung.

### 2.3. Quy trình Trợ lý AI & Tóm tắt sách
1. **AI Tra cứu & Tư vấn sách:** Độc giả nhập nhu cầu (ví dụ: *"Tôi muốn tìm sách rèn luyện tư duy phản biện"*). AI sử dụng danh mục kho sách hiện có (qua Prompt RAG v3) để gợi ý chính xác tối đa 5 cuốn sách có trong thư viện, trả lời súc tích $\le 300$ ký tự dưới dạng JSON.
2. **AI Tóm tắt nội dung sách (AI Summarizer):** Tại chi tiết cuốn sách, người dùng bấm nút "AI Tóm tắt". Hệ thống phân tích nội dung, xuất ra 3 ý chính và bài học thực tiễn trong 3 giây.

---

## 3. YÊU CẦU CHỨC NĂNG CHI TIẾT

### 3.1. Phân hệ Xác thực & Quản lý Tài khoản (Auth & Profiles)

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F01** | Đăng nhập hệ thống | Xác thực tài khoản qua username/password, cấp phiên làm việc theo vai trò RBAC. | Tất cả |
| **F02** | Đăng ký độc giả mới | Bạn đọc tự đăng ký trực tuyến; tự động kiểm tra trùng lặp username, cấp mã ID và lưu trữ bền vững. | Guest |
| **F03** | Đăng xuất an toàn | Hủy phiên đăng nhập, xóa token/state và chuyển hướng về trang Login. | Admin, Reader |
| **F04** | Cập nhật hồ sơ cá nhân | Độc giả tự cập nhật họ tên, số điện thoại, email, địa chỉ, ngày sinh. | Reader |
| **F05** | Đổi mật khẩu bảo mật | Yêu cầu xác thực mật khẩu hiện tại trước khi thiết lập mật khẩu mới. | Admin, Reader |
| **F06** | Bảo vệ tuyến đường (Guard) | Tự động chuyển hướng về trang Login nếu người dùng chưa đăng nhập cố tình truy cập link nội bộ. | Hệ thống |

### 3.2. Phân hệ Quản lý Danh mục Sách (Book Inventory CRUD)

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F07** | Xem danh sách sách | Hiển thị 2 chế độ: Dạng lưới thẻ (Grid View) và Dạng bảng danh mục (Table View) có phân trang. | Admin, Reader |
| **F08** | Xem chi tiết sách | Modal hiển thị bìa sách, tựa đề, tác giả, thể loại, số lượng, vị trí kệ, tóm tắt và đánh giá sao. | Admin, Reader |
| **F09** | Thêm sách mới | Nhập thông tin sách, tự động tính `available = quantity`, lưu trữ tập trung vào CSDL. | Admin |
| **F10** | Sửa thông tin sách | Cập nhật thông tin mục lục, tự động tính toán lại số lượng khả dụng dựa trên số đang cho mượn. | Admin |
| **F11** | Xóa sách khỏi kho | Mở Modal xác nhận nội bộ; **chặn tuyệt đối nếu sách đang có phiếu mượn hoặc đang có người đặt trước**. | Admin |
| **F12** | Tìm kiếm thời gian thực | Live Search toàn cục theo Tựa sách, Tác giả, Thể loại, Mã sách; kích hoạt nhanh bằng phím tắt `/`. | Admin, Reader |
| **F13** | Lọc và sắp xếp | Lọc theo thể loại, tình trạng kho (Còn/Hết); sắp xếp theo Tên A-Z, Ngày mới nhất, Điểm đánh giá. | Admin, Reader |

### 3.3. Phân hệ Lưu thông, Mượn - Trả & Đặt trước (Circulation & Reservations)

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F14** | Đăng ký mượn sách | Độc giả chọn sách còn tồn, chọn hình thức (Mượn về/Tại chỗ) và hạn trả; tạo phiếu `Pending`. | Reader |
| **F15** | Phê duyệt yêu cầu mượn | Thủ thư bấm Duyệt: trạng thái thành `Approved`, kho tự giảm `available -= 1`, sinh thông báo. | Admin |
| **F16** | Từ chối yêu cầu mượn | Thủ thư bấm Không duyệt: trạng thái thành `Rejected`, sinh thông báo lý do đến độc giả. | Admin |
| **F17** | Trả sách trực tuyến | Độc giả bấm Trả sách trên cổng cá nhân, giao diện cập nhật ngay tức thì (0ms Optimistic UI). | Reader |
| **F18** | Xác nhận nhập kho sách trả | Thủ thư xác nhận nhận lại sách, kho tăng `available += 1`, tự động kiểm tra hàng đợi đặt trước. | Admin |
| **F19** | Gia hạn mượn sách (Renewal) | Độc giả yêu cầu gia hạn thêm 7 ngày nếu sách chưa quá hạn và chưa có độc giả khác đặt trước. | Reader |
| **F20** | Đặt trước sách (Reservation) | Khi `available = 0`, nút mượn tự chuyển thành "Đặt trước". Độc giả vào hàng đợi chờ ưu tiên (FIFO). | Reader |
| **F21** | Xử lý ưu tiên nhận sách | Khi sách được trả, hệ thống gửi thông báo giữ sách 48h cho người đầu danh sách đặt trước. | Hệ thống |
| **F22** | Hủy đặt trước | Độc giả chủ động hủy yêu cầu đặt trước hoặc hệ thống tự hủy khi quá hạn 48h giữ chỗ. | Reader, System |
| **F23** | Tra cứu lịch sử mượn trả | Phân loại phiếu: Tất cả, Chờ duyệt, Đang mượn, Đã trả; Admin xem toàn bộ, Độc giả xem của mình. | Admin, Reader |
| **F24** | Tính phí phạt quá hạn (Fines) | Tự động tính phí phạt theo ngày quá hạn khi hoàn tất thủ tục trả sách trễ hạn quy định. | Hệ thống |

### 3.4. Phân hệ Quản lý Độc giả (Reader Management)

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F25** | Xem danh mục độc giả | Bảng danh sách: Mã thẻ thư viện (`DG-xxx`), Họ tên, Username, Email, SĐT, Địa chỉ, Trạng thái thẻ. | Admin |
| **F26** | Thêm mới thẻ độc giả | Thủ thư cấp thẻ thư viện mới cho bạn đọc trực tiếp tại quầy. | Admin |
| **F27** | Chỉnh sửa thẻ độc giả | Cập nhật thông tin liên lạc và gia hạn thời hạn hiệu lực của thẻ thư viện. | Admin |
| **F28** | Xóa hồ sơ độc giả | Mở Modal xác nhận nội bộ; **chặn xóa nếu độc giả đang giữ sách mượn hoặc có phiếu chờ duyệt**. | Admin |

### 3.5. Phân hệ Thống kê, Báo cáo & Xuất Chứng từ Số

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F29** | Dashboard KPI thời gian thực | 4 thẻ chỉ số: Tổng sách, Đang mượn, Tổng độc giả, Yêu cầu chờ duyệt. Tự cập nhật khi có biến động. | Admin |
| **F30** | Biểu đồ trực quan | Biểu đồ SVG tương tác thống kê tỷ lệ và số lượt mượn theo từng nhóm thể loại sách. | Admin |
| **F31** | Xuất báo cáo Excel (.xlsx) | Dùng `openpyxl` xuất kho sách và lịch sử mượn trả: có màu tiêu đề, viền ô, auto-width cột. | Admin |
| **F32** | Xuất phiếu mượn PDF kèm QR | Dùng `reportlab` xuất phiếu mượn trang trọng, nhúng mã QR Code động tra cứu qua điện thoại. | Admin |
| **F33** | Xuất danh sách CSV tiếng Việt | Xuất tệp CSV chèn ký tự UTF-8 BOM (`\ufeff`), mở bằng Microsoft Excel Windows không lỗi font. | Admin |

### 3.6. Phân hệ Trí tuệ Nhân tạo & Tương tác Bạn đọc (AI Assistant & UX)

| Mã YC | Tên chức năng | Mô tả chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **F34** | Widget AI Chatbot nổi | Nút Bot tròn nổi góc phải màn hình, thiết kế phẳng tinh gọn, mở/đóng khung đối thoại mượt mà. | Admin, Reader |
| **F35** | Banner gợi ý thông minh | Thông điệp *"Bạn cần tôi giúp đỡ gì không? ✨"* tự hiện 7 giây đầu, tự thu gọn và tự hiện khi hover. | Admin, Reader |
| **F36** | Hoạt họa tư duy 5 giây | Animation 3 dấu chấm nhảy múa (bouncing dots) 5s mô phỏng nhịp điệu tra cứu tự nhiên của thủ thư. | Admin, Reader |
| **F37** | AI RAG tư vấn kho sách | Tích hợp Prompt RAG v3: nhận diện nhu cầu, gợi ý tối đa 5 cuốn từ kho `{{book_list}}`, xuất JSON. | Admin, Reader |
| **F38** | AI Tóm tắt nội dung sách | Nút "AI Tóm tắt" tại chi tiết sách: trích xuất 3 ý chính và bài học thực tiễn trong 3 giây. | Admin, Reader |
| **F39** | Cơ chế Smart Fallback | Tự động chuyển sang bộ tri thức chuyên gia thư viện nội bộ khi mất mạng hoặc chưa có API Key. | Hệ thống |
| **F40** | Hộp thư thông báo tức thì | Hộp thư thông báo realtime cập nhật kết quả duyệt mượn/trả và thông báo nhận sách đặt trước. | Admin, Reader |

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NFR)

### 4.1. Hiệu năng & Tốc độ phản hồi (Performance)
- Thao tác CRUD và duyệt mượn/trả áp dụng kỹ thuật **Optimistic UI Update**, phản hồi giao diện ngay lập tức (**0ms**).
- Tìm kiếm Live Search toàn cục trả kết quả gợi ý trong vòng **< 100ms** sau mỗi ký tự gõ.
- Quá trình xuất báo cáo Excel, PDF có mã QR và CSV hoàn tất trong vòng **< 1.5 giây**.

### 4.2. Độ tin cậy & Tính sẵn sàng (Reliability & Availability)
- Hệ thống áp dụng nguyên lý **Lập trình phòng thủ (Defensive Programming)**: 100% lệnh gọi API và truy xuất dữ liệu được bọc trong khối `try/catch`. Ứng dụng không bao giờ bị crash trắng màn hình.
- Cơ chế **Smart Fallback** bảo đảm tính năng Trợ lý AI luôn hoạt động ổn định kể cả khi mất kết nối mạng Internet.

### 4.3. An toàn & Bảo mật Dữ liệu (Security)
- Kiểm soát phân quyền đa tầng: Tầng Giao diện (ẩn/hiện chức năng theo vai trò) và Tầng Máy chủ (kiểm tra quyền truy cập endpoint API).
- Mật khẩu người dùng được băm an toàn bằng thuật toán SHA-256 trước khi lưu trữ đối soát.

### 4.4. Trải nghiệm Người dùng (UI/UX Excellence)
- **Loại bỏ 100% popup thô sơ của trình duyệt (`alert/confirm`):** Thay thế bằng Custom Confirmation Modal có hiệu ứng làm mờ nền (backdrop blur) và Toast Notification tự ẩn sau 3.5 giây.
- Giao diện phẳng tinh tế (Borderless Flat Design), can thiệp CSS `.ai-chat-input` triệt tiêu hoàn toàn viền focus xanh mặc định của trình duyệt.

---

## 5. RÀNG BUỘC HỆ THỐNG & TOÀN VẸN DỮ LIỆU

### 5.1. Ràng buộc Toàn vẹn Khóa ngoại (Referential Integrity)
1. **Chặn xóa sách:** Không cho phép xóa một đầu sách nếu cuốn sách đó đang có phiếu mượn ở trạng thái `Approved` (đang mượn) hoặc `Pending` (chờ duyệt) hoặc đang có người đặt trước.
2. **Chặn xóa độc giả:** Không cho phép xóa tài khoản độc giả nếu độc giả đó đang giữ sách chưa hoàn trả về thư viện.
3. **Ràng buộc Tồn kho:** Số lượng tổng `quantity` phải là số nguyên dương $\ge 1$; số lượng sẵn có `available` luôn thỏa mãn: $0 \le available \le quantity$.

### 5.2. Ràng buộc Nghiệp vụ Đặt trước & Mượn sách
1. Độc giả chỉ được đặt trước sách khi và chỉ khi sách đó có `available = 0`.
2. Mỗi độc giả chỉ được mượn tối đa 5 cuốn sách cùng lúc và chỉ được gia hạn 1 lần cho mỗi lượt mượn.

---

## 6. MÔI TRƯỜNG HOẠT ĐỘNG VÀ TRIỂN KHAI ĐA NỀN TẢNG

| Môi trường | Công nghệ Thực thi | Đặc điểm Kỹ thuật & Vai trò |
| :--- | :--- | :--- |
| **Máy chủ Cục bộ (Localhost)** | Python 3.10+ (FastAPI) + React 18 SPA + MySQL 8.0 (SQLAlchemy 2.0 / PyMySQL) | Vận hành trên CSDL Quan hệ MySQL 8.0 (hoặc JSON fallback tự động); hỗ trợ đầy đủ các module xuất tệp Excel, PDF có QR và CSV. |
| **Nền tảng Trực tuyến (GitHub Pages)** | Client-side React SPA + LocalStorage Engine | Tự động nhận diện host tĩnh `github.io`, kích hoạt LocalStorage Sync Engine (`DB_VERSION`), hỗ trợ demo trực tiếp 100% chức năng không cần cài đặt. |
| **Đóng gói Ảo hóa (Docker)** | Multi-stage Dockerfile + Docker Compose (MySQL + App) | Đóng gói 2 container phối hợp: `smartlib_mysql` (MySQL 8.0 với volume `mysql_data`) và `smartlib_app` (FastAPI + React); dữ liệu lưu trữ bền vững 100%. |

---

*Tài liệu Đặc tả Yêu cầu Phần mềm này phản ánh đầy đủ 100% các chức năng và ràng buộc kỹ thuật đã được xây dựng và kiểm chứng trong Dự án SmartLib v3.0.*
