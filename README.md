# AlgoVision - Trực quan hóa Cấu trúc Dữ liệu & Giải thuật

**Dự án Bài tập lớn môn Kiểm thử Phần mềm**

AlgoVision là nền tảng Web tương tác giúp minh họa trực quan các thuật toán sắp xếp, tìm kiếm và cấu trúc dữ liệu. Xây dựng bằng React.js + Tailwind CSS.

## 🚀 Tính năng (Sprint 1)

### Thuật toán Sắp xếp (Sorting)
- **Bubble Sort** — Sắp xếp nổi bọt O(n²)
- **Quick Sort** — Sắp xếp nhanh O(n log n)
- **Merge Sort** — Sắp xếp trộn O(n log n)

### Thuật toán Tìm kiếm (Searching)
- **Linear Search** — Tìm kiếm tuyến tính O(n)
- **Binary Search** — Tìm kiếm nhị phân O(log n)

### Cấu trúc Dữ liệu (Data Structures)
- **Singly Linked List** — Danh sách liên kết đơn
  - Chèn node (Đầu / Cuối / Giữa) với animation duyệt, fly-up và nối mũi tên
  - Xoá node với animation highlight và fade-out

### Tính năng chung
- Sinh mảng ngẫu nhiên (tối đa 50 phần tử)
- Điều khiển Play / Pause / Reset
- Thanh chỉnh tốc độ (Speed Slider)

## 💻 Công nghệ
- **Vite** + **React.js**
- **Tailwind CSS**
- **JavaScript Generators** (`function*` / `yield`) điều khiển animation từng bước

## 📁 Cấu trúc thư mục
```
algovision-app/
├── src/
│   ├── engine/
│   │   ├── sorting/        # Bubble, Quick, Merge Sort
│   │   ├── searching/      # Linear, Binary Search
│   │   └── datastructures/ # Singly Linked List
│   ├── hooks/              # useAlgorithm (custom hook)
│   ├── components/         # Navbar
│   ├── pages/              # Home, Workspace
│   └── utils/              # arrayUtils
├── public/
└── .github/workflows/      # CI/CD
```

## 📦 Khởi chạy dự án
Yêu cầu: Node.js đã được cài đặt.
```bash
cd algovision-app
npm install
npm run dev
```