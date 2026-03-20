# AlgoVision - Algorithm Visualization Platform

**Dự án Bài tập lớn môn Kỹ thuật Phần mềm (Sprint 1, 2, 3)**

AlgoVision là ứng dụng web hỗ trợ học tập thông qua việc trực quan hóa các thuật toán sắp xếp, tìm kiếm và cấu trúc dữ liệu. Dự án được xây dựng bằng React.js và Tailwind CSS.

## 🛠️ Tính năng chính

### So sánh thuật toán & Mở rộng - Sprint 3
- **So sánh thuật toán (Battle Mode)**: Chạy song song hai thuật toán trên cùng một bộ dữ liệu để so sánh hiệu năng.
- **Giao diện 4 Thẻ (Bento Grid)**: Truy cập trực tiếp các phân hệ Sắp xếp, Tìm kiếm, Danh sách liên kết ngay từ Trang chủ.
- **Mở khóa Premium & Ads (Mockup)**: Mở khóa thuật toán nâng cao (Gnome, Thanos) qua luồng giả lập quảng cáo/thanh toán.
- **CI/CD**: Tích hợp GitHub Actions cho quy trình kiểm thử và đóng gói tự động.

### Trải nghiệm người dùng - Sprint 2
- **Mã giả (Pseudocode)**: Hiển thị code và làm nổi bật dòng đang chạy đồng bộ với hoạt ảnh trực quan.
- **Giao diện đa nền tảng**: Chế độ Sáng/Tối (Neubrutalism) tối ưu cho cả máy tính và thiết bị di động.

### Thuật toán cốt lõi - Sprint 1
- **Sorting**: Trực quan hóa Bubble Sort, Quick Sort, Merge Sort.
- **Searching**: Tìm kiếm Tuyến tính và Tìm kiếm Nhị phân.
- **Cấu trúc dữ liệu**: Hoạt ảnh Danh sách liên kết đơn (Thêm/Xóa node và nối con trỏ).
- **Tiện ích**: Điều chỉnh tốc độ (Speed Slider), sinh mảng ngẫu nhiên và nhập mảng tùy chỉnh.

## 📁 Cấu trúc thư mục
```text
algovision-app/
├── src/
│   ├── engine/             # Logic thuật toán (sort, search, datastruct)
│   ├── store/              # Quản lý LocalStorage và app state (US09, US10)
│   ├── hooks/              # useAlgorithm, useBattle, useTheme
│   ├── pages/              # Home, Workspace, Battle
│   ├── components/         # Navbar, UnlockModal, PseudocodePanel
│   ├── utils/              # Tiện ích chung (sinh mảng, format)
│   └── App.jsx             # Entry point & Routing
├── .github/workflows/      # CI/DC Pipeline (Lint & Build)
└── package.json            # Scripts & Dependencies
```

## 💻 Công nghệ sử dụng
- **React 19**: Xây dựng UI component.
- **Tailwind CSS**: Styling giao diện (Dark Mode).
- **JS Generators**: Điều khiển animation thuật toán từng bước.
- **GitHub Actions**: Tự động hóa quy trình kiểm thử và đóng gói.

## 📦 Khởi chạy
```bash
cd algovision-app
npm install
npm run dev
```

---
**Nhóm thực hiện**: Squad AlgoVision (Hà & Long).