# 🇻🇳 TrustHerBro

> **"Người đầu tiên chờ đón bạn khi bạn lần đầu tiên đặt chân đến Việt Nam."**

Một người bạn đồng hành tích hợp AI được thiết kế để bảo vệ và hướng dẫn những nữ du khách độc hành (từ 18–30 tuổi) trong những giờ đầu tiên dễ bị tổn thương nhất tại Việt Nam, bằng cách sử dụng khả năng lập luận bối cảnh theo thời gian thực và dữ liệu an toàn từ cộng đồng.

📊 **[Live Demo](https://trust-her-bro-1.vercel.app)** | 🛠️ **Công nghệ:** Next.js App Router (TypeScript 98.5%) & Supabase

---

## 💡 Lý do dự án ra đời: Câu chuyện & Nguồn cảm hứng

### Xây dựng cho sự yếu thế, không chỉ cho kỳ nghỉ
Hầu hết các ứng dụng du lịch hiện nay được xây dựng để tối ưu hóa cho một "kỳ nghỉ" — tìm quán cà phê trứng ngon nhất, đặt homestay hợp xu hướng nhất, hoặc check-in chụp ảnh tại Vịnh Hạ Long. **Nhưng chúng tôi chọn xây dựng cho những khoảnh khắc con người dễ bị tổn thương nhất.**

Hãy tưởng tượng một cô gái từ 18 đến 30 tuổi đi du lịch một mình, bước xuống chuyến bay tại Sân bay Quốc tế Nội Bài hoặc Tân Sơn Nhất vào lúc 11:45 đêm. Bạn kiệt sức về thể xác, mất phương hướng về văn hóa và hoàn toàn đơn độc. Thẻ SIM địa phương chưa kích hoạt được, những con đường bên ngoài trông tối tăm, vắng vẻ, và bạn lập tức bị bủa vây bởi những tài xế "taxi dù" chèo kéo gay gắt.

Trong chính khoảnh khắc đó, câu hỏi chạy qua đầu bạn không phải là *"Quán ăn nào được đánh giá cao nhất?"*. Đó là một chuỗi những câu hỏi sinh tồn đầy lo ấu:
* *"Người này có đang lừa đảo mình không?"*
* *"Hiện tại mình có an toàn không?"*
* *"Mình có nên tin tưởng tài xế này không?"*

### Những hiểu biết cốt lõi thúc đẩy chúng tôi
`TrustHerBro` được ra đời từ những câu chuyện có thật của các nữ du khách độc hành và cái nhìn trực diện vào những rủi ro thực tế tại địa phương (từ chiêu trò tráo tiền của taxi dù cho đến những bẫy lừa đảo "vô hình" như mời mua đồ ăn cho chim quanh Hồ Hoàn Kiếm). Chúng tôi định vị sản phẩm dựa trên ba thông tin sắc bén:
1. **Rủi ro được phân bổ theo thời gian và trạng thái tâm lý, không chỉ theo địa lý.** Giai đoạn nguy hiểm nhất của một chuyến đi không phải là ngày thứ năm; đó là 120 phút đầu tiên.
2. **An toàn là một bài toán lập luận bối cảnh, không phải là tra cứu dữ liệu tĩnh.** Bạn không chỉ cần một tấm bản đồ; bạn cần sự xác thực về mặt bối cảnh để biết *ai* và *điều gì* có thể tin tưởng.
3. **"Vẻ ngoài ngơ ngác" chính là một tín hiệu mục tiêu.** Việc đứng trên một góc phố tối tăm và dán mắt vào màn hình điện thoại một cách bối rối sẽ biến người du khách thành mục tiêu sơ hở. Sản phẩm của chúng tôi giúp cô ấy trông tự tin hơn, thông qua các tính năng như **Chế độ âm thanh kín đáo (Discreet Audio Mode)** để hướng dẫn cô ấy trực tiếp qua tai nghe.

Chúng tôi đang xây dựng một người bạn đồng hành ấm áp, nhân văn và cực kỳ trực quan. Một AI không chỉ hiển thị dữ liệu thô, mà đứng cạnh cô ấy như một người bạn bản địa đáng tin cậy, trả lời câu hỏi thực sự trong tâm trí cô ấy: **"Tôi có nên tin điều này không, và tôi phải làm gì tiếp theo?"**

---

## 🪜 Nấc thang tin cậy: 4 Chế độ AI cốt lõi

Giao diện và mức độ can thiệp của ứng dụng sẽ tự động thay đổi linh hoạt dựa trên mức độ rủi ro của du khách:

| Chế độ | Mục đích cốt lõi | Kích hoạt khi nào | Tính năng AI chính |
| :--- | :--- | :--- | :--- |
| **1. First Night** (Đêm đầu tiên) | Chào đón, định hướng và thiết lập lộ trình khi vừa hạ cánh | Tự động khi đến nơi / Quá giờ bay dự kiến / Định vị gần sân bay | Lập luận đa biến để tạo ra một **Dòng thời gian sinh tồn (Survival Timeline)** cá nhân hóa và hướng dẫn di chuyển chính thống. |
| **2. Assistant** (Trợ lý) | Giải mã văn hóa và đồng hành khám phá hàng ngày | Người dùng hỏi bằng ngôn ngữ tự nhiên ("Giá taxi này có ổn không?") | Giải mã ngữ cảnh địa phương, sàng lọc các đơn vị lữ hành, cung cấp giá tham chiếu chuẩn để tránh bị nói thách. |
| **3. Safety** (An toàn phòng ngừa) | **Bảo vệ phòng ngừa** khi có dấu hiệu bất ổn | Người dùng thể hiện sự bất an ("Tài xế đổi đường") HOẶC phát hiện bất thường từ định vị | Kích hoạt **Chế độ kín đáo** (hướng dẫn qua tai nghe), tìm tuyến đường sáng và đông dân hơn, tự động kiểm tra an toàn (check-in). |
| **4. Emergency** (Khẩn cấp cứu hộ) | **Phản ứng khủng hoảng** khi gặp nguy hiểm ngay lập tức | Kích hoạt bằng giọng nói "Cứu tôi" / Nút hoảng loạn / Xác thực an toàn thất bại | **Giao diện tối giản, tối ưu cho sóng yếu**. Chia sẻ vị trí trực tiếp cho người thân, gọi nhanh các đầu số khẩn cấp (113/115), hiển thị thẻ cầu cứu bằng tiếng Việt. |

---

## 🛠️ Phân tích kỹ thuật chuyên sâu

Ứng dụng của chúng tôi được xây dựng trên nền tảng **Next.js App Router** hiện đại, tối ưu hóa cho việc render tại Edge, nhận biết bối cảnh theo thời gian thực và đảm bảo hiệu năng ổn định ngay cả dưới điều kiện sóng điện thoại yếu.

### Kiến trúc Tech Stack hiện đại
* **Framework:** Next.js (App Router) viết bằng **TypeScript (98.5%)** nhằm đảm bảo an toàn kiểu dữ liệu tuyệt đối và cấu trúc dữ liệu chặt chẽ.
* **Database & Auth:** **Supabase** xử lý luồng đăng ký/đăng nhập nhanh chóng, lưu trữ bản ghi trạng thái và quản lý phiên làm việc bảo mật.
* **Styling & Components:** Custom Tailwind CSS kết hợp giao diện **Vietnamese Heritage Theme** (Đậm bản sắc Việt) với các thẻ UI độ tương phản cao để dễ đọc trong điều kiện thiếu sáng hoặc tình huống khẩn cấp.

### Tại sao bài toán này bắt buộc phải dùng AI nâng cao (Thay vì bộ lọc điều kiện thông thường)?
1. **Tổng hợp bối cảnh đa biến (Multi-Variable Context Synthesis):** Không một bộ lọc logic truyền thống nào có thể xử lý mượt mà tổ hợp dữ liệu `[11:45 PM + Đi một mình + Nữ + Lần đầu đến + Tại ga đến Nội Bài]` để đưa ra một dòng thời gian sinh tồn cá nhân hóa, tuần tự theo thời gian thực. AI tự động ánh xạ các tuyến đường không gian cùng với các biến thời gian và ghi chú của cộng đồng một cách tự nhiên.
2. **Chuyển đổi chế độ bằng ngôn ngữ tự nhiên (Natural Language State-Switching):** Người dùng khi hoảng sợ sẽ không bấm qua các menu phức tạp. Họ nhập hoặc nói ra cảm xúc thô: *"Tôi không biết mình có đang làm quá lên không, nhưng con phố này vắng quá."* Mô hình ngôn ngữ lớn (LLM) của chúng tôi sẽ phân tích sắc thái cảm xúc ẩn sau đó và tự động chuyển từ **Chế độ Trợ lý** sang **Chế độ An toàn** ngay lập tức.
3. **Thu thập dữ liệu phi cấu trúc (Unstructured Data Aggregation):** Chúng tôi xử lý hàng ngàn đoạn văn bản phi cấu trúc từ các diễn đàn du lịch uy tín dành cho phụ nữ, trích xuất các chỉ số rủi ro cục bộ, xếp hạng an toàn do cộng đồng đóng góp và bản đồ rủi ro động thông qua kỹ thuật tóm tắt bằng NLP tiên tiến.

---

## 📦 Cấu trúc Thư mục Dự án

Mã nguồn được tổ chức theo dạng mô-đun để dễ dàng bảo trì và phân tách các luồng xử lý một cách rõ ràng:
```text
├── .github/             # CI/CD Workflows & actions (Luồng tự động triển khai tính năng)
├── app/                 # Next.js App Router Pages (Luồng UI cốt lõi)
│   ├── onboarding/      # Luồng Onboarding < 30 giây cho Đêm đầu tiên
│   ├── timeline/        # Công cụ xử lý và hiển thị trực quan Dòng thời gian sinh tồn
│   └── api/             # Các tuyến API mock để ngắt kết nối linh hoạt giữa AI/TTS sau này
├── components/          # Các thành phần giao diện tái sử dụng (Thẻ trạng thái an toàn,...)
├── lib/                 # Các tiện ích cốt lõi (Core utility hooks) & Cấu hình API
├── public/              # Tài nguyên hình ảnh mang bản sắc Việt Nam & các token giao diện
├── scripts/             # Kịch bản nạp dữ liệu, xử lý diễn đàn và các công cụ tự động
└── utils/supabase       # Tích hợp cơ sở dữ liệu Supabase Client/Server & Luồng xác thực