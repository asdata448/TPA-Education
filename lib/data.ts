export const tutors = [
  {
    id: 1,
    name: "Nguyễn Nguyên Anh",
    role: "Gia sư Toán & Tin học Lập trình",
    subjects: ["Toán học", "Tin học lập trình"],
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NguyenAnh-XPZSf8rgFny6gCo35jsAH5NZhUfQN5.jpg",
    avatarPosition: "object-top",
    education: "ĐH Khoa học Tự nhiên, ĐHQG-HCM — Cử nhân Khoa học và CN Vật liệu (Bán dẫn) · GPA 8.0",
    achievements: [
      "Thành viên Vòng chọn Đội tuyển Quốc gia môn Tin học (2024)",
      "Giải Ba SEAL Hackathon Fall 2025 — Bảng AI Innovation",
      "Quán quân Crane Battle Innovation — Dự án CaFLOW",
      "Giải Ba Khoa học Kỹ thuật Cấp Thành phố (2024)",
      "Giải Ba Olympic Tin học TP.HCM & Giải Nhất cấp Quận (2021)",
      "Mentor lập trình tại CyberSoft Academy (04/2026 – nay)",
      "Cựu học sinh Lớp Chuyên Tin THPT Gia Định TP.HCM",
    ],
    experience: "2+ năm",
    students: "30+",
    rating: "4.9/5",
    teachingMethod: "Áp dụng Gamification (lồng ghép ví dụ Marvel/Iron Man) và Project-based Learning để học sinh tự xây sản phẩm thực tế. Thiết kế lộ trình cá nhân hóa – điển hình là giáo trình 3 tháng dạy lập trình robot và tạo video AI cho học sinh 12 tuổi.",
    languages: ["Python", "C++", "Scratch", "HTML/CSS", "React"],
    contact: {
      phone: "0899 736 669",
      email: "tameanhanh@gmail.com",
    },
  },
  {
    id: 2,
    name: "Nguyễn Lê Thiện",
    role: "Gia sư Vật lý",
    subjects: ["Vật lý"],
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thien-296Ar7kDTpat2qRpLAam23lbAfJsX9.jpg",
    avatarPosition: "object-top",
    education: "ĐH Khoa học Tự nhiên, ĐHQG-HCM — Cử nhân CN Vật liệu (Bán dẫn) · GPA 8.5/10",
    achievements: [
      "ĐTB 4 năm THCS đạt 9.6+ | ĐTB 3 năm THPT đạt 9.0+",
      "Học sinh chuyên Lý — THPT Chuyên Trần Hưng Đạo (Bình Thuận)",
      "Giải HSG môn Lý cấp trường và cấp huyện",
      "Học bổng khuyến khích học tập môn Lý lớp 12",
      "ĐTB các môn Lý đại học (Vật lý ĐC 1&2, Vật lý Hiện đại…) đạt 9.5+",
      "Kinh nghiệm dạy gia sư lớp 6–11",
    ],
    experience: "2+ năm",
    students: "20+",
    rating: "4.9/5",
    teachingMethod: "Nói không với học vẹt — giúp học sinh hiểu rõ bản chất vật lý. Phương pháp sáng tạo, trực quan, phù hợp cho cả học sinh mất gốc lẫn học sinh khá giỏi muốn lên chuyên sâu.",
    contact: {
      phone: "0945 245 977",
      email: "nglethien2006cv@gmail.com",
    },
  },
  {
    id: 3,
    name: "Nguyễn Trọng Phúc",
    role: "Gia sư Hóa học",
    subjects: ["Hóa học"],
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phuc-mEzRSPDYRQDlJbmroFFfVWBsYg3a8s.jpg",
    avatarPosition: "object-[50%_20%]",
    education: "ĐH Khoa học Tự nhiên, ĐHQG-HCM — CN Vật liệu Polymer Composite · Điểm đầu vào 25đ",
    achievements: [
      "Tốt nghiệp THPT Thuận Hưng loại Giỏi — ĐTB 9.0+",
      "Giải Ba HSG Hóa lý thuyết cấp Thành phố lớp 9",
      "Giải KK HSG Hóa lý thuyết & thực hành cấp Quận lớp 9",
      "Giải KK HSG Hóa thực hành cấp Thành phố lớp 11",
      "ĐTB môn Hóa 9.0+ từ lớp 8 đến lớp 12",
      "Kinh nghiệm giúp học sinh mất gốc thi đỗ THPT",
      "Tham gia HSG KHTN Tiếng Anh & HSG Tiếng Anh cấp Thành phố",
    ],
    experience: "2+ năm",
    students: "25+",
    rating: "4.9/5",
    teachingMethod: "Kết hợp lý thuyết với hình ảnh thực tế, giúp học sinh hiểu rõ bản chất phản ứng thay vì học thuộc lòng. Nhiệt tình, chăm chỉ, yêu trẻ — đặc biệt giỏi giúp học sinh mất gốc tìm lại nền tảng.",
    contact: {
      phone: "0393 404 842",
      email: "trongphuc20075858@gmail.com",
    },
  },
]

export const subjects = [
  {
    id: 1,
    name: "Toán học",
    icon: "Calculator",
    description: "Đại số, Hình học, Giải tích, Xác suất thống kê",
    levels: ["THCS", "THPT"],
    color: "navy",
  },
  {
    id: 2,
    name: "Tin học Lập trình",
    icon: "Code2",
    description: "Python, C++, Scratch, Tư duy thuật toán",
    levels: ["THCS", "THPT"],
    color: "gold",
  },
  {
    id: 3,
    name: "Vật lý",
    icon: "Atom",
    description: "Cơ học, Điện từ, Quang học, Nhiệt học",
    levels: ["THCS", "THPT"],
    color: "navy",
  },
  {
    id: 4,
    name: "Hóa học",
    icon: "FlaskConical",
    description: "Hóa vô cơ, Hóa hữu cơ, Phương trình phản ứng",
    levels: ["THCS", "THPT"],
    color: "gold",
  },
]

export const packages = [
  {
    id: 1,
    name: "Gói Lấy Gốc",
    duration: "4 tuần",
    sessions: "8 buổi",
    description: "Dành cho học sinh mất gốc, cần củng cố kiến thức nền tảng",
    features: [
      "Đánh giá trình độ ban đầu",
      "Lộ trình cá nhân hóa",
      "Bài tập về nhà hàng ngày",
      "Báo cáo tiến độ hàng tuần",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Gói Tăng Điểm",
    duration: "8 tuần",
    sessions: "16 buổi",
    description: "Nâng cao điểm số, cải thiện thứ hạng trong lớp",
    features: [
      "Tất cả quyền lợi Gói Lấy Gốc",
      "Luyện đề kiểm tra thường xuyên",
      "Hỗ trợ giải đáp 24/7",
      "Tài liệu học tập độc quyền",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Gói Ôn Thi",
    duration: "12 tuần",
    sessions: "24 buổi",
    description: "Chuẩn bị thi chuyển cấp, THPT Quốc gia",
    features: [
      "Tất cả quyền lợi Gói Tăng Điểm",
      "Luyện đề thi thực tế",
      "Phân tích điểm mạnh/yếu",
      "Chiến lược làm bài thi",
    ],
    popular: false,
  },
  {
    id: 4,
    name: "TPA+ Coding Lab",
    duration: "Linh hoạt",
    sessions: "Theo nhu cầu",
    description: "Học lập trình từ cơ bản đến nâng cao",
    features: [
      "Scratch cho người mới bắt đầu",
      "Python & C++ nâng cao",
      "Dự án thực tế",
      "Chuẩn bị thi Tin học trẻ",
    ],
    popular: false,
  },
]

export const faqs = [
  {
    question: "Làm thế nào để đăng ký học tại TPA+?",
    answer: "Bạn có thể đăng ký bằng cách điền form liên hệ trên website, gọi điện hotline, hoặc nhắn tin qua Facebook/Zalo. Chúng tôi sẽ liên hệ tư vấn trong vòng 24h.",
  },
  {
    question: "Học phí tại TPA+ như thế nào?",
    answer: "Học phí được tính theo buổi, tùy thuộc vào môn học và cấp độ. Chúng tôi sẽ tư vấn chi tiết sau khi đánh giá trình độ học sinh. Có ưu đãi khi đăng ký theo gói.",
  },
  {
    question: "Có được học thử trước khi đăng ký không?",
    answer: "Có! TPA+ cung cấp 1 buổi học thử MIỄN PHÍ để học sinh và phụ huynh đánh giá chất lượng giảng dạy trước khi quyết định đăng ký.",
  },
  {
    question: "Gia sư có đến nhà dạy không?",
    answer: "Có, chúng tôi hỗ trợ cả hình thức Online (qua Zoom/Google Meet) và Offline (tại nhà học sinh hoặc địa điểm thỏa thuận trong khu vực Dĩ An, Thủ Đức, Làng Đại học).",
  },
  {
    question: "Lịch học có linh hoạt không?",
    answer: "Lịch học được sắp xếp linh hoạt theo thời gian của học sinh. Học sinh có thể đổi lịch với thông báo trước 24h.",
  },
  {
    question: "Phụ huynh có được cập nhật tiến độ học tập không?",
    answer: "Có! Phụ huynh sẽ nhận báo cáo tiến độ hàng tuần qua Zalo/Email, bao gồm đánh giá năng lực, điểm mạnh/yếu, và đề xuất cải thiện.",
  },
  {
    question: "TPA+ cam kết gì về chất lượng?",
    answer: "Chúng tôi cam kết: Tiến bộ rõ rệt sau 4 tuần hoặc hoàn tiền; Gia sư có trình độ và kinh nghiệm; Lộ trình học tập cá nhân hóa; Hỗ trợ giải đáp ngoài giờ học.",
  },
]

export const consultationProcess = [
  {
    step: 1,
    title: "Tiếp nhận yêu cầu",
    description: "Phụ huynh/học sinh liên hệ qua hotline, form website hoặc mạng xã hội",
    icon: "MessageCircle",
    duration: "Ngay lập tức",
  },
  {
    step: 2,
    title: "Tư vấn miễn phí",
    description: "Trao đổi về nhu cầu học tập, mục tiêu, và giới thiệu gia sư phù hợp",
    icon: "Phone",
    duration: "15-30 phút",
  },
  {
    step: 3,
    title: "Bài test đầu vào",
    description: "Đánh giá trình độ hiện tại để xây dựng lộ trình học tập cá nhân hóa",
    icon: "ClipboardCheck",
    duration: "30-45 phút",
  },
  {
    step: 4,
    title: "Buổi học thử",
    description: "1 buổi học thử MIỄN PHÍ để trải nghiệm phương pháp giảng dạy",
    icon: "BookOpen",
    duration: "60-90 phút",
  },
  {
    step: 5,
    title: "Xác nhận đăng ký",
    description: "Chọn gói học, xác nhận lịch học và bắt đầu hành trình tiến bộ",
    icon: "CheckCircle2",
    duration: "Linh hoạt",
  },
]

export const learningPaths = [
  {
    duration: "4 tuần",
    name: "Gói Nền Tảng",
    target: "Học sinh mất gốc",
    milestones: [
      { week: 1, content: "Đánh giá & xây dựng lộ trình" },
      { week: 2, content: "Củng cố kiến thức cơ bản" },
      { week: 3, content: "Luyện tập & áp dụng" },
      { week: 4, content: "Kiểm tra & đánh giá tiến bộ" },
    ],
    outcome: "Nắm vững kiến thức nền tảng, sẵn sàng học nâng cao",
  },
  {
    duration: "8 tuần",
    name: "Gói Tăng Tốc",
    target: "Muốn cải thiện điểm số",
    milestones: [
      { week: "1-2", content: "Hoàn thiện kiến thức cơ bản" },
      { week: "3-4", content: "Nâng cao và mở rộng" },
      { week: "5-6", content: "Luyện đề và kỹ năng làm bài" },
      { week: "7-8", content: "Ôn tập tổng hợp & đánh giá" },
    ],
    outcome: "Tăng 1.5-2 điểm, tự tin trong các bài kiểm tra",
  },
  {
    duration: "12 tuần",
    name: "Gói Chinh Phục",
    target: "Chuẩn bị thi quan trọng",
    milestones: [
      { week: "1-3", content: "Hệ thống hóa toàn bộ kiến thức" },
      { week: "4-6", content: "Chuyên sâu các dạng bài khó" },
      { week: "7-9", content: "Luyện đề thi thực tế" },
      { week: "10-12", content: "Tổng ôn & chiến lược làm bài" },
    ],
    outcome: "Đạt mục tiêu điểm số, tự tin bước vào phòng thi",
  },
]

export const commitments = [
  {
    title: "Cam kết tiến bộ",
    description: "Học sinh tiến bộ rõ rệt sau 4 tuần hoặc hoàn tiền 100%",
    icon: "TrendingUp",
  },
  {
    title: "Báo cáo định kỳ",
    description: "Phụ huynh nhận báo cáo tiến độ chi tiết hàng tuần",
    icon: "FileText",
  },
  {
    title: "Hỗ trợ 24/7",
    description: "Giải đáp thắc mắc ngoài giờ học qua Zalo/Messenger",
    icon: "HeadphonesIcon",
  },
  {
    title: "Lộ trình cá nhân",
    description: "Mỗi học sinh có lộ trình học riêng, phù hợp năng lực",
    icon: "Route",
  },
  {
    title: "Gia sư chất lượng",
    description: "100% gia sư từ các trường Đại học hàng đầu",
    icon: "GraduationCap",
  },
  {
    title: "Đổi gia sư miễn phí",
    description: "Không phù hợp? Đổi gia sư khác hoàn toàn miễn phí",
    icon: "RefreshCw",
  },
]
