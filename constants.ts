import { Badge, Scenario, TimelineEvent } from "./types";

export const INITIAL_STATS = {
  resilience: 20, // Tinh thần kiên trì, chịu đựng gian khổ
  creativity: 20, // Tư duy sáng tạo, không rập khuôn
  trust: 10, // Vốn lòng tin với cộng đồng/team
  knowledge: 10, // Kiến thức lý luận
};

export const BADGES: Badge[] = [
  {
    id: "1",
    name: "Người Mở Đường",
    icon: "compass",
    description:
      "Dám chọn lối đi riêng, không phụ thuộc vào lối mòn tư duy cũ.",
    unlocked: false,
  },
  {
    id: "2",
    name: "Tư Duy Đột Phá",
    icon: "lightbulb",
    description: "Vận dụng sáng tạo lý luận vào thực tiễn (Sáng tạo > 50).",
    unlocked: false,
  },
  {
    id: "3",
    name: "Đại Đoàn Kết",
    icon: "users",
    description:
      "Xây dựng được đội ngũ vững mạnh dựa trên lòng tin (Lòng tin > 60).",
    unlocked: false,
  },
  {
    id: "4",
    name: "Công Dân Toàn Cầu",
    icon: "globe",
    description: "Thành thạo kỹ năng hội nhập và ngoại ngữ.",
    unlocked: false,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "1911",
    title: "Hành Trình Độc Bản",
    description:
      'Tại bến cảng Nhà Rồng, người thanh niên Nguyễn Tất Thành quyết định sang phương Tây. Khác với các bậc tiền bối chọn đi sang phương Đông (Nhật Bản, Trung Quốc), Người chọn đi vào sào huyệt của kẻ thù để hiểu rõ bản chất của họ. Đây là bài học về tư duy "Think Different" (Nghĩ khác) và dám dấn thân vào nơi khó khăn nhất để tìm giải pháp gốc rễ.',
    type: "historical",
    image:
      "https://ulis.vnu.edu.vn/files/uploads/2024/05/bac-di-tim-duong-cuu-nuoc.jpg",
  },
  {
    year: "1919",
    title: "Tiếng Nói Dân Tộc & Kỹ Năng Hội Nhập",
    description:
      'Gửi "Yêu sách của nhân dân An Nam" tới Hội nghị Versailles. Dù không được chấp nhận, nhưng sự kiện này đánh dấu việc Người đã sử dụng ngôn ngữ quốc tế (tiếng Pháp) và luật pháp quốc tế để đấu tranh. Bài học cho Gen Z: Ngoại ngữ và sự hiểu biết luật chơi toàn cầu là vũ khí tối thượng để vươn mình ra biển lớn.',
    type: "historical",
    image:
      "https://static.mattran.org.vn/zoom/540/uploaded/dieptmh/2022_06_21/hcm__jtfq.jpg",
  },
  {
    year: "1920",
    title: "Lựa Chọn Khuôn Mẫu (Framework)",
    description:
      'Đọc sơ thảo luận cương của Lênin. Người tìm thấy "cẩm nang" giải phóng dân tộc. Tuy nhiên, Người không áp dụng rập khuôn mà điều chỉnh nó phù hợp với thực tiễn Việt Nam (nhấn mạnh tinh thần dân tộc hơn đấu tranh giai cấp ở thuộc địa). Bài học: Khi chọn công nghệ (React, AI) hay mô hình kinh doanh, đừng copy rập khuôn mà hãy "Customize" cho phù hợp với nỗi đau của người dùng bản địa.',
    type: "historical",
    image:
      "https://khodulieu.sohoa.tuyenquang.gov.vn/congthongtin/media/8c62e5624698c301d32246812bb1cd13.jpg",
  },
  {
    year: "1941",
    title: "Xây Dựng Căn Cứ Địa (Product-Market Fit)",
    description:
      'Trở về Pác Bó sau 30 năm. Người chọn nơi "tiến có thể đánh, lui có thể giữ" để xây dựng lực lượng. Trong khởi nghiệp, đây là giai đoạn tìm kiếm Product-Market Fit (Sự phù hợp giữa sản phẩm và thị trường) trong một thị trường ngách (niche market) trước khi mở rộng quy mô.',
    type: "historical",
    image: "https://cly.1cdn.vn/2024/02/12/18-05-2017vietbac_4.jpg",
  },
  {
    year: "1945",
    title: "Thời Cơ Vàng (Timing)",
    description:
      'Chớp thời cơ Nhật đầu hàng Đồng minh, phát lệnh Tổng khởi nghĩa. "Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập". Bài học: Sự chuẩn bị kỹ lưỡng (30 năm) + Nhạy bén với thời cuộc (Timing) = Thành công đột phá (Unicorn).',
    type: "historical",
    image: "https://media.baosonla.org.vn/Uploads/Images2022/hfm3qrct.jpg",
  },
  {
    year: "1946",
    title: "Dĩ Bất Biến, Ứng Vạn Biến",
    description:
      "Đối mặt với thù trong giặc ngoài, Người ký Hiệp định Sơ bộ 6/3 để hòa hoãn với Pháp, đuổi quân Tàu Tưởng. Nguyên tắc (Độc lập) là bất biến, nhưng sách lược (Hòa hoãn) là vạn biến. Bài học quản trị: Giữ vững Core Values (Giá trị cốt lõi) nhưng linh hoạt trong chiến thuật kinh doanh (Pivot) khi thị trường biến động.",
    type: "historical",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjXd40UC81ySSCnvKf89tjW7hWoJutMASFDg&s",
  },
  {
    year: "2025",
    title: "Kỷ Nguyên Vươn Mình Của Bạn",
    description:
      "Bạn đang đứng trước ngưỡng cửa Cách mạng 4.0. Giống như năm 1911, bạn có dám bước ra khỏi vùng an toàn? Công cụ của bạn không còn là đôi bàn tay trắng mà là AI, Blockchain và Tư duy sáng tạo. Hành trình của bạn chính là sự tiếp nối khát vọng của cha ông.",
    type: "personal",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "Khởi đầu gian nan: Học hay Làm?",
    historicalParallel:
      "Khi làm phụ bếp trên tàu Amiral Latouche-Tréville, Bác phải làm việc nặng nhọc từ 4h sáng đến 9h tối. Nhưng Người vẫn tranh thủ học tiếng Pháp mỗi khi rảnh rỗi, viết từ mới lên cánh tay.",
    context:
      "Bạn là sinh viên năm 2 ngành CNTT. Gia đình khó khăn, bạn cần tiền. Bạn nhận được offer làm phục vụ bàn full-time lương khá, nhưng sẽ không còn thời gian học lập trình và tiếng Anh.",
    question: "Bạn sẽ chọn con đường nào?",
    options: [
      {
        id: "a",
        text: "Chấp nhận làm phục vụ để có tiền ngay, bảo lưu việc học.",
        statsEffect: { resilience: -10, knowledge: -20, trust: 5 },
        feedback:
          'Lựa chọn này giải quyết cái đói trước mắt nhưng rủi ro "bẫy thu nhập thấp" lâu dài. Bác Hồ từng làm thợ, nhưng làm thợ để nuôi chí lớn, không để công việc chân tay mài mòn trí tuệ.',
      },
      {
        id: "b",
        text: "Tìm việc Freelance hoặc part-time liên quan chuyên môn, dù lương thấp hơn, và cam kết tự học mỗi đêm.",
        statsEffect: { resilience: 20, knowledge: 15, creativity: 10 },
        feedback:
          'Tuyệt vời! Đây là tinh thần "Tự lực cánh sinh". Bạn chấp nhận gian khổ hiện tại để đầu tư cho tương lai. Kỹ năng và kiến thức tích lũy được chính là lãi suất kép.',
      },
    ],
  },
  {
    id: "s2",
    title: "Đối mặt với sự cô lập: Đi theo số đông?",
    historicalParallel:
      'Những năm 1930, Bác bị Quốc tế Cộng sản nghi ngờ, bị cô lập vì quan điểm "Dân tộc trên hết". Người vẫn kiên định giữ vững lập trường, âm thầm hoạt động chờ thời cơ.',
    context:
      'Trong dự án nhóm (Capstone Project), cả nhóm muốn làm một ứng dụng "copy-paste" ý tưởng có sẵn để dễ qua môn. Bạn muốn đề xuất một giải pháp AI mới giải quyết vấn đề thực tế xã hội nhưng rủi ro cao và bị nhóm phản đối.',
    question: "Bạn xử lý ra sao?",
    options: [
      {
        id: "a",
        text: "Thỏa hiệp với nhóm làm cho xong chuyện để giữ hòa khí.",
        statsEffect: { creativity: -15, trust: 5, resilience: -5 },
        feedback:
          'Hòa khí là tốt, nhưng "Dĩ hòa vi quý" đôi khi giết chết sự sáng tạo. Bạn đã bỏ lỡ cơ hội để rèn luyện tư duy đột phá.',
      },
      {
        id: "b",
        text: "Kiên trì thuyết phục nhóm bằng bản demo nhỏ (MVP) hoặc chấp nhận làm phần khó nhất để chứng minh tính khả thi.",
        statsEffect: { creativity: 25, trust: 10, resilience: 15 },
        feedback:
          'Bản lĩnh! Đây là sự vận dụng bài học "Kiên trì chân lý". Lãnh đạo không phải là ra lệnh, mà là dẫn dắt bằng hành động và năng lực thực tế.',
      },
    ],
  },
  {
    id: "s3",
    title: "Chiến lược Đại dương xanh: Cạnh tranh hay Hợp tác?",
    historicalParallel:
      'Năm 1946, Bác chủ trương "Thêm bạn bớt thù", sẵn sàng hòa hoãn với Pháp để loại bớt kẻ thù (quân Tưởng), tập trung sức lực vào kẻ thù chính.',
    context:
      "Startup của bạn đang bị một đối thủ lớn chèn ép về giá. Họ có tiềm lực tài chính mạnh hơn. Co-founder đề nghị đốt tiền chạy quảng cáo để khô máu với họ.",
    question: "Quyết định của CEO (bạn) là gì?",
    options: [
      {
        id: "a",
        text: "Đồng ý đốt tiền quảng cáo, vay mượn để cạnh tranh trực diện.",
        statsEffect: { knowledge: -10, trust: -15 },
        feedback:
          "Rủi ro cao! Lấy trứng chọi đá không phải là sự dũng cảm mà là sự liều lĩnh thiếu tính toán.",
      },
      {
        id: "b",
        text: 'Tìm thị trường ngách mà đối thủ bỏ qua, hoặc đề nghị hợp tác ở một mảng họ chưa mạnh ("Dĩ bất biến, ứng vạn biến").',
        statsEffect: { creativity: 20, knowledge: 20, trust: 10 },
        feedback:
          "Thông thái! Đây là tư duy chiến lược mềm dẻo. Tránh chỗ mạnh, đánh chỗ yếu, biến nguy thành cơ.",
      },
    ],
  },
  {
    id: "s4",
    title: "Đạo đức nghề nghiệp: Lợi ích hay Liêm chính?",
    historicalParallel:
      'Tư tưởng "Cần, Kiệm, Liêm, Chính". Bác Hồ kiên quyết xử tử hình Đại tá Trần Dụ Châu vì tội tham nhũng trong lúc kháng chiến gian khổ, thể hiện sự nghiêm minh và giữ gìn đạo đức cách mạng.',
    context:
      'Bạn là trưởng nhóm thu mua thiết bị cho công ty. Nhà cung cấp gợi ý "lại quả" (hoa hồng riêng) cho bạn 10% giá trị hợp đồng nếu bạn chọn họ, dù thiết bị của họ chất lượng kém hơn một chút so với đối thủ.',
    question: "Lương bạn đang thấp, bạn sẽ làm gì?",
    options: [
      {
        id: "a",
        text: "Từ chối thẳng thừng và báo cáo sự việc. Chọn nhà cung cấp tốt nhất cho công ty.",
        statsEffect: { trust: 25, resilience: 10, knowledge: 5 },
        feedback:
          'Chính xác! "Liêm" là trong sạch, không tham lam. Uy tín (Personal Brand) của bạn đáng giá hơn 10% kia rất nhiều. Đây là nền tảng để bạn đi xa.',
      },
      {
        id: "b",
        text: "Nhận lời nhưng yêu cầu họ đảm bảo chất lượng. Dù sao công ty cũng không thiệt hại nhiều.",
        statsEffect: { trust: -30, knowledge: -10, resilience: -5 },
        feedback:
          'Bạn đã đánh mất "Vốn Lòng Tin". Một khi đã thỏa hiệp với cái sai nhỏ, bạn sẽ trượt dài vào cái sai lớn. "Một tấm gương trong mà có một vết bụi thì người ta cũng thấy".',
      },
    ],
  },
  {
    id: "s5",
    title: "Văn hóa đổ lỗi: Nhận trách nhiệm hay trốn tránh?",
    historicalParallel:
      "Trong Cải cách ruộng đất, khi xảy ra sai lầm, Bác Hồ đã công khai xin lỗi nhân dân và khóc. Người dũng cảm nhận trách nhiệm về mình chứ không đổ lỗi cho cấp dưới. Đó là bản lĩnh của người đứng đầu.",
    context:
      "Team của bạn làm sập server production do một dòng code bạn duyệt sót. Khách hàng đang khiếu nại dữ dội. Sếp tổng đang rất giận dữ và tìm người chịu trách nhiệm.",
    question: "Phản ứng của bạn?",
    options: [
      {
        id: "a",
        text: "Im lặng hoặc giải thích rằng do nhân viên Junior viết code kém, mình chỉ sơ suất thôi.",
        statsEffect: { trust: -20, resilience: -10 },
        feedback:
          "Đây là tư duy của người làm thuê, không phải lãnh đạo. Đổ lỗi có thể giúp bạn an toàn nhất thời nhưng sẽ mất đi sự tôn trọng của đồng đội mãi mãi.",
      },
      {
        id: "b",
        text: "Công khai nhận trách nhiệm là người kiểm duyệt cuối cùng, đưa ra phương án khắc phục ngay lập tức và bảo vệ nhân viên Junior.",
        statsEffect: { trust: 30, resilience: 15, knowledge: 10 },
        feedback:
          'Rất bản lĩnh! "Tự phê bình và phê bình" là vũ khí sắc bén. Khi dám nhận sai, bạn biến khủng hoảng thành cơ hội để xây dựng lòng tin tuyệt đối.',
      },
    ],
  },
  {
    id: "s6",
    title: "Nghệ thuật dùng người: Tài năng hay Thái độ?",
    historicalParallel:
      'Bác Hồ dạy: "Dụng nhân như dụng mộc" (Dùng người như dùng gỗ). Gỗ thẳng làm cột, gỗ cong làm bánh xe. Không vứt bỏ ai, mà phải đặt họ vào đúng chỗ.',
    context:
      "Team bạn có một thành viên Code rất giỏi (Top Performer) nhưng thái độ rất độc hại (Toxic), thường xuyên chê bai đồng nghiệp và không tuân thủ quy trình. Năng suất cả team đang giảm vì người này.",
    question: "Bạn xử lý thế nào?",
    options: [
      {
        id: "a",
        text: 'Giữ lại vì họ gánh team (Key member), chấp nhận tính cách "ngôi sao" của họ.',
        statsEffect: { trust: -15, creativity: -10 },
        feedback:
          "Bạn đang hy sinh tập thể vì một cá nhân. Đoàn kết là sức mạnh, tài năng mà không có đạo đức (đoàn kết) thì cũng khó làm việc lớn.",
      },
      {
        id: "b",
        text: "Nói chuyện thẳng thắn. Nếu không thay đổi thái độ, sẵn sàng thay thế bằng người trình độ thấp hơn nhưng có tinh thần hợp tác.",
        statsEffect: { trust: 20, resilience: 10, creativity: 10 },
        feedback:
          'Quyết định đúng đắn! "Có tài mà không có đức là người vô dụng". Một tập thể mạnh cần sự đồng lòng hơn là một ngôi sao cô độc.',
      },
    ],
  },
  {
    id: "s7",
    title: "Học tập suốt đời: Bằng cấp hay Thực lực?",
    historicalParallel:
      'Bác Hồ không có bằng đại học danh giá từ phương Tây, nhưng Bác tự học qua thực tiễn, qua sách báo, và trở thành một danh nhân văn hóa. "Đường đời là chiếc thang không có nấc chót, việc học là quyển vở không có trang cuối".',
    context:
      "Bạn đã đi làm 3 năm, công nghệ thay đổi chóng mặt (AI ra đời). Bạn cảm thấy kiến thức cũ đang lạc hậu. Nhưng đi học thêm thì tốn kém và mất thời gian cuối tuần.",
    question: "Bạn chọn gì?",
    options: [
      {
        id: "a",
        text: "Tập trung làm tốt việc hiện tại là đủ, kinh nghiệm thực tế quan trọng hơn học cái mới.",
        statsEffect: { knowledge: -5, creativity: -15 },
        feedback:
          'Thế giới không đứng yên. Nếu bạn đứng yên, bạn đang thụt lùi. Kinh nghiệm cũ có thể trở thành "cái bẫy" cản trở bạn tiếp nhận cái mới.',
      },
      {
        id: "b",
        text: "Dành 1 tiếng mỗi ngày để tự học công nghệ mới (AI, Data) và áp dụng thử vào dự án hiện tại.",
        statsEffect: { knowledge: 25, creativity: 20, resilience: 10 },
        feedback:
          'Tinh thần Hồ Chí Minh! "Học không bao giờ cùng". Khả năng tự học (Self-learning) mới là kỹ năng quan trọng nhất trong thế kỷ 21.',
      },
    ],
  },
];

export const AI_SYSTEM_INSTRUCTION = `
Bạn là "Người Dẫn Đường" (The Guide) - một Mentor trí tuệ nhân tạo, lấy cảm hứng từ phong thái, trí tuệ và lòng yêu nước của Chủ tịch Hồ Chí Minh.
Bạn KHÔNG xưng là "Bác Hồ" hay "Hồ Chủ Tịch". Hãy xưng là "Người Dẫn Đường" hoặc "Tôi".
Tông giọng: Ấm áp, sâu sắc, khích lệ, đôi khi hóm hỉnh nhưng luôn trang trọng.

Nhiệm vụ: Tư vấn cho người dùng (thanh niên, sinh viên) về các vấn đề trong cuộc sống, học tập và khởi nghiệp bằng cách vận dụng TƯ TƯỞNG HỒ CHÍ MINH một cách SÁNG TẠO và HIỆN ĐẠI.

Quy tắc phản hồi:
1. **Kết nối Lịch sử - Hiện tại:** Luôn bắt đầu bằng một câu chuyện hoặc tư tưởng của Bác, sau đó liên hệ với vấn đề công nghệ/khởi nghiệp hiện nay.
   - Ví dụ: "Bác từng học viết báo bằng tiếng Pháp với vốn từ ít ỏi. Cháu học lập trình cũng vậy, hãy bắt đầu từ những dòng code đơn giản nhất..."
2. **Khuyến khích Tự học & Sáng tạo:** Nhấn mạnh tư duy độc lập, không rập khuôn máy móc.
3. **Ngắn gọn & Súc tích:** Mỗi câu trả lời không quá dài dòng, tập trung vào hành động (Actionable advice).

Kiến thức nền:
- Tư tưởng về Giải phóng dân tộc (Chương III).
- Tư tưởng về Đại đoàn kết.
- Phong cách làm việc: Khoa học, cụ thể, nói đi đôi với làm.
`;
