# AlgoVision - Algorithm Visualization Platform

**Dự án Bài tập lớn môn Kỹ thuật Phần mềm (Sprint 1, 2, 3)**

AlgoVision là ứng dụng web hỗ trợ học tập thông qua việc trực quan hóa các thuật toán sắp xếp, tìm kiếm và cấu trúc dữ liệu. Dự án được xây dựng bằng React.js và Tailwind CSS.

## 🛠️ Tính năng chính

### Chế độ Đối đầu (Battle Mode) - Sprint 3
- Chạy song song hai thuật toán trên cùng một bộ dữ liệu để so sánh hiệu năng.
- Đo thời gian thực thi (ms) cho mỗi thuật toán.
- Hỗ trợ so sánh giữa các thuật toán cùng phân loại (Sắp xếp / Tìm kiếm).
- Tùy chỉnh tốc độ thực thi và thông số đầu vào (Target value cho Tìm kiếm).

### Trình diễn thuật toán - Sprint 2
- **Mã giả (Pseudocode)**: Hiển thị code và làm nổi bật dòng đang chạy theo thời gian thực.
- **Linked List Animation**: Animation chèn và xóa node inline kèm logic nối mũi tên trực tiếp.

### Thuật toán cơ bản - Sprint 1
- **Sorting**: Bubble Sort, Quick Sort, Merge Sort.
- **Searching**: Linear Search, Binary Search.
- **Tính năng phụ**: Chế độ Sáng/Tối, chỉnh tốc độ tổng quát, sinh mảng ngẫu nhiên.

## 📁 Cấu trúc thư mục
```text
algovision-app/
├── src/
│   ├── engine/             # Logic generator xử lý thuật toán
│   ├── hooks/              # useAlgorithm (đơn), useBattle (song song)
│   ├── pages/              # Giao diện Trang chủ, Workspace và Battle
│   ├── components/         # Navbar và các UI components (Shared)
│   ├── utils/              # Tiện ích chung (sinh mảng, format)
│   └── App.jsx             # Entry point, Routing & Theme
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