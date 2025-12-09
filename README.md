# Change-Makers (DTU Volunteer Platform)

Một nền tảng tình nguyện hiện đại cho phép sinh viên tìm kiếm, đăng ký và tham gia các hoạt động tình nguyện, đồng thời kết nối với các tổ chức và tình nguyện viên khác.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Chức năng của User](#chức-năng-của-user)
- [Chức năng của Admin](#chức-năng-của-admin)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## 🎯 Tổng quan

Change-Makers là một nền tảng web toàn diện cho phép:
- **Sinh viên/Tình nguyện viên**: Tìm kiếm và đăng ký các hoạt động tình nguyện phù hợp
- **Tổ chức**: Đăng tải và quản lý các hoạt động tình nguyện
- **Admin**: Quản lý toàn bộ hệ thống, người dùng, tổ chức và nội dung

## 🛠 Công nghệ sử dụng

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (v18 trở lên)
- MongoDB (local hoặc Atlas)
- npm hoặc yarn

### Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dtu_volunteer
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`

### Cài đặt Frontend

```bash
cd frontend
npm install
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### Seed Database (Tùy chọn)

Để tạo dữ liệu mẫu:

```bash
cd backend
npm run seed
```

## 👤 Chức năng của User

### 1. Xác thực (Authentication)
- **Đăng ký**: Tạo tài khoản mới với email, mật khẩu, thông tin cá nhân
- **Đăng nhập**: Xác thực bằng email và mật khẩu
- **Đăng xuất**: Kết thúc phiên làm việc
- **Cập nhật Profile**:
  - Thay đổi thông tin cá nhân (tên, số điện thoại, bio)
  - Upload ảnh đại diện
  - Thêm kỹ năng
  - Upload CV/Resume

### 2. Tìm kiếm và Duyệt Duties (Hoạt động tình nguyện)
- **Trang Home**:
  - Hero section với banner slider
  - Danh sách duties mới nhất
  - Danh sách duties phổ biến
- **Trang Duties**:
  - Hiển thị tất cả duties với banner slider
  - Lọc theo:
    - Địa điểm (Location)
    - Loại công việc (Job Type)
    - Mức độ kinh nghiệm (Experience Level)
  - Tìm kiếm theo từ khóa
- **Trang Browse**:
  - Duyệt duties theo danh mục
  - Banner slider
  - Filter tương tự trang Duties
- **Trang Upcoming Events**:
  - Hiển thị các sự kiện sắp tới (trong 7 ngày)
  - Sự kiện đang mở đăng ký
  - Sự kiện có deadline sắp đến
  - Hiển thị hình ảnh sự kiện

### 3. Chi tiết Duty
- **Xem thông tin chi tiết**:
  - Tiêu đề, mô tả, yêu cầu
  - Thông tin tổ chức (tên, địa chỉ, website, logo)
  - Địa điểm, thời gian, số lượng vị trí
  - Hình ảnh (gallery với lightbox)
  - Ngày bắt đầu, kết thúc, deadline
- **Đăng ký tham gia**:
  - Nút "Apply" để đăng ký
  - Hiển thị trạng thái đăng ký (Pending, Accepted, Rejected)
- **Báo cáo Duty**: Báo cáo nếu có nội dung không phù hợp
- **Leaderboard**:
  - Xem top contributors (người đóng góp nhiều nhất)
  - Xem profile của các contributors
- **Tab Group**:
  - Xem posts trong group của duty
  - Tạo post mới (nếu đã được accept)
  - Like, comment, share posts
  - Xem comments và replies

### 4. Quản lý Ứng tuyển
- **Xem trạng thái ứng tuyển**:
  - Pending (Đang chờ)
  - Accepted (Đã chấp nhận)
  - Rejected (Đã từ chối)
- **Xem lịch sử ứng tuyển**: Danh sách tất cả duties đã ứng tuyển

### 5. Profile và Hoạt động
- **Trang Profile**:
  - Xem thông tin cá nhân
  - Xem thống kê (số posts, likes, comments)
  - Xem kỹ năng và resume
  - Xem lịch sử hoạt động
  - Cập nhật thông tin
- **Xem Profile người khác**:
  - Xem profile của contributors
  - Follow/Unfollow users
  - Xem thống kê đóng góp

### 6. Social Features
- **Kết bạn (Follow/Unfollow)**:
  - Gửi lời mời kết bạn
  - Chấp nhận/từ chối lời mời
  - Xem danh sách bạn bè
  - Xem trạng thái kết bạn
- **Tin nhắn (Messages)**:
  - Chat real-time với bạn bè
  - Xem danh sách conversations
  - Gửi và nhận tin nhắn
  - Hiển thị unread messages
  - Server-Sent Events cho real-time updates
- **Thông báo (Notifications)**:
  - Nhận thông báo real-time về:
    - Friend requests
    - Friend accepted
    - New messages
    - Application accepted/rejected
  - Đánh dấu đã đọc
  - Xóa thông báo
  - Badge hiển thị số thông báo chưa đọc

### 7. Groups và Posts
- **Groups**:
  - Tự động tham gia group khi được accept vào duty
  - Xem posts trong group
  - Tạo posts với hình ảnh
  - Like, comment, share posts
  - Xem comments và replies
  - Báo cáo posts/comments không phù hợp

## 👨‍💼 Chức năng của Admin

### 1. Dashboard
- **Tổng quan hệ thống**:
  - Số lượng users, organizations, duties
  - Số lượng applications, posts, groups
  - Thống kê hoạt động

### 2. Quản lý Users
- **Xem danh sách users**:
  - Tìm kiếm users
  - Xem thông tin chi tiết
  - Xem role (user/admin)
- **Quản lý users**:
  - Xóa users
  - Thay đổi role (nếu cần)

### 3. Quản lý Organizations
- **Xem danh sách organizations**:
  - Tìm kiếm organizations
  - Xem thông tin chi tiết (tên, địa chỉ, website, logo)
- **Tạo organization mới**:
  - Modal form để tạo organization
  - Upload logo
  - Nhập thông tin (tên, mô tả, địa chỉ, website)
  - Chọn owner (user)
- **Cập nhật organization**:
  - Sửa thông tin
  - Thay đổi logo
- **Xóa organization**

### 4. Quản lý Duties
- **Xem danh sách duties**:
  - Tìm kiếm duties
  - Xem thông tin chi tiết
  - Xem số lượng applications
- **Tạo duty mới**:
  - Modal form để tạo duty
  - Upload nhiều hình ảnh
  - Nhập thông tin đầy đủ:
    - Tiêu đề, mô tả, yêu cầu
    - Địa điểm, loại công việc, mức độ kinh nghiệm
    - Số lượng vị trí, thời gian làm việc
    - Ngày bắt đầu, kết thúc, deadline
    - Chọn organization
  - Đặt trạng thái mở/đóng
- **Cập nhật duty**:
  - Sửa tất cả thông tin
  - Thay đổi hình ảnh
- **Xóa duty**
- **Xem Applicants**:
  - Xem danh sách người ứng tuyển cho mỗi duty
  - Xem trạng thái ứng tuyển
  - Accept/Reject applications

### 5. Quản lý Groups
- **Xem danh sách groups**:
  - Xem tất cả groups
  - Xem thông tin group (tên, mô tả, duty liên kết)
  - Xem số lượng members
- **Quản lý Members**:
  - Xem danh sách members trong group
  - Thêm members vào group (multi-select):
    - Chọn từ danh sách users đã được accept vào duty
    - Thêm nhiều users cùng lúc
  - Xóa members khỏi group:
    - Reset application status khi remove member
- **Xem Applications**:
  - Xem danh sách applications cho duty của group
  - Accept/Reject applications từ dialog
  - Dialog hiển thị đầy đủ thông tin ứng viên

### 6. Quản lý Posts
- **Xem danh sách posts**:
  - Xem tất cả posts từ tất cả groups
  - Xem thông tin post (author, content, images)
  - Xem số lượng likes, comments, shares
- **Tạo post mới**:
  - Modal form để tạo post
  - Upload nhiều hình ảnh
  - Nhập nội dung
  - Chọn group
- **Cập nhật post**:
  - Sửa nội dung
  - Thay đổi hình ảnh
- **Xóa post**

### 7. Quản lý Reports
- **Xem danh sách reports**:
  - Xem tất cả reports (posts, comments, duties)
  - Xem lý do báo cáo
  - Xem mô tả chi tiết
  - Xem người báo cáo
- **Xử lý reports**:
  - Xem nội dung bị báo cáo
  - Xóa nội dung nếu vi phạm
  - Dismiss report nếu không vi phạm

## 📁 Cấu trúc dự án

```
Change-Makers-Website/
├── backend/
│   ├── controllers/          # Business logic
│   │   ├── admin_controller.js
│   │   ├── application_controller.js
│   │   ├── comment_controller.js
│   │   ├── duty_controller.js
│   │   ├── friend_controller.js
│   │   ├── group_controller.js
│   │   ├── message_controller.js
│   │   ├── notification_controller.js
│   │   ├── organization_controller.js
│   │   ├── post_controller.js
│   │   ├── report_controller.js
│   │   └── user_controller.js
│   ├── middlewares/          # Middleware functions
│   │   ├── isAdmin.js
│   │   ├── isAuthenticated.js
│   │   └── multer.js
│   ├── models/               # MongoDB schemas
│   │   ├── application_model.js
│   │   ├── comment_model.js
│   │   ├── conversation_model.js
│   │   ├── duty_model.js
│   │   ├── friend_model.js
│   │   ├── group_model.js
│   │   ├── message_model.js
│   │   ├── notification_model.js
│   │   ├── organization_model.js
│   │   ├── post_model.js
│   │   ├── report_model.js
│   │   └── user_model.js
│   ├── routes/               # API routes
│   │   ├── admin_route.js
│   │   ├── application_route.js
│   │   ├── comment_route.js
│   │   ├── duty_route.js
│   │   ├── friend_route.js
│   │   ├── group_route.js
│   │   ├── message_route.js
│   │   ├── notification_route.js
│   │   ├── organization_route.js
│   │   ├── post_route.js
│   │   ├── report_route.js
│   │   └── user_route.js
│   ├── scripts/             # Utility scripts
│   │   └── seed.js
│   ├── utils/               # Utility functions
│   │   ├── cloudinary.js
│   │   ├── datauri.js
│   │   └── db.js
│   ├── index.js             # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/        # Admin components
    │   │   ├── auth/         # Authentication components
    │   │   ├── shared/       # Shared components (Navbar, Footer)
    │   │   ├── ui/           # UI components (Button, Dialog, etc.)
    │   │   └── *.jsx         # Main components
    │   ├── redux/            # Redux store và slices
    │   ├── utils/            # Utility functions và constants
    │   └── App.jsx           # Main App component
    └── package.json
```

## 🔌 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `GET /logout` - Đăng xuất
- `POST /profile/update` - Cập nhật profile
- `GET /top-contributors` - Lấy top contributors
- `GET /profile/:userId` - Lấy profile user

### Duty Routes (`/api/v1/duty`)
- `GET /` - Lấy tất cả duties
- `GET /:id` - Lấy duty theo ID
- `POST /create` - Tạo duty mới (admin)
- `PUT /:id` - Cập nhật duty (admin)
- `DELETE /:id` - Xóa duty (admin)
- `GET /filter-options` - Lấy filter options

### Organization Routes (`/api/v1/organization`)
- `GET /` - Lấy tất cả organizations
- `GET /:id` - Lấy organization theo ID
- `POST /create` - Tạo organization (admin)
- `PUT /:id` - Cập nhật organization (admin)
- `DELETE /:id` - Xóa organization (admin)

### Application Routes (`/api/v1/app`)
- `POST /apply` - Ứng tuyển duty
- `GET /my-applications` - Lấy applications của user
- `PUT /:id/status` - Cập nhật trạng thái (admin)

### Friend Routes (`/api/v1/friend`)
- `POST /follow` - Follow/Unfollow user
- `POST /unfollow` - Unfollow user
- `POST /accept` - Chấp nhận friend request
- `GET /friends` - Lấy danh sách bạn bè
- `GET /status/:otherUserId` - Kiểm tra trạng thái kết bạn

### Message Routes (`/api/v1/message`)
- `POST /send` - Gửi tin nhắn
- `GET /conversations` - Lấy danh sách conversations
- `GET /conversation/:conversationId` - Lấy messages của conversation
- `GET /sse` - SSE endpoint cho real-time messages

### Notification Routes (`/api/v1/notification`)
- `GET /` - Lấy notifications
- `PUT /:notificationId/read` - Đánh dấu đã đọc
- `PUT /read-all` - Đánh dấu tất cả đã đọc
- `DELETE /:notificationId` - Xóa notification
- `GET /sse` - SSE endpoint cho real-time notifications

### Group Routes (`/api/v1/group`)
- `GET /` - Lấy tất cả groups
- `GET /:id` - Lấy group theo ID
- `POST /create` - Tạo group (admin)
- `PUT /:id` - Cập nhật group (admin)
- `DELETE /:id` - Xóa group (admin)
- `POST /:id/members` - Thêm members (admin)
- `DELETE /:id/members/:userId` - Xóa member (admin)

### Post Routes (`/api/v1/post`)
- `GET /` - Lấy tất cả posts
- `GET /:id` - Lấy post theo ID
- `POST /create` - Tạo post
- `PUT /:id` - Cập nhật post
- `DELETE /:id` - Xóa post
- `POST /:id/like` - Like/Unlike post
- `POST /:id/share` - Share post

### Comment Routes (`/api/v1/comment`)
- `POST /create` - Tạo comment
- `PUT /:id` - Cập nhật comment
- `DELETE /:id` - Xóa comment
- `POST /:id/like` - Like/Unlike comment

### Report Routes (`/api/v1/report`)
- `POST /create` - Tạo report
- `GET /` - Lấy tất cả reports (admin)
- `DELETE /:id` - Xóa report (admin)

### Admin Routes (`/api/v1/admin`)
- `GET /stats` - Lấy thống kê (admin)
- `GET /users` - Lấy tất cả users (admin)
- `DELETE /users/:id` - Xóa user (admin)

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dtu_volunteer
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend
Frontend sử dụng constants trong `src/utils/constant.js` để định nghĩa API endpoints.

## 📝 Ghi chú

- Tất cả API endpoints yêu cầu authentication (trừ register/login) sử dụng JWT token trong cookies
- Admin routes yêu cầu role `admin` trong JWT token
- File uploads được xử lý qua Multer và lưu trữ trên Cloudinary
- Real-time features sử dụng Server-Sent Events (SSE)
- State management sử dụng Redux Toolkit với Redux Persist để lưu trữ state

## 👥 Tác giả

DTU Volunteer Platform - Change-Makers

## 📄 License

ISC
"# Volunteer-Project-Capstone" 
