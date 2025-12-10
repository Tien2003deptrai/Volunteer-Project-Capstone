import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../utils/db.js";
import { User } from "../models/user_model.js";
import { Organization } from "../models/organization_model.js";
import { Duty } from "../models/duty_model.js";
import { Application } from "../models/application_model.js";
import { Group } from "../models/group_model.js";
import { Post } from "../models/post_model.js";
import { Comment } from "../models/comment_model.js";

dotenv.config();

// Fake data arrays
const firstNames = ["Anh", "Binh", "Chau", "Dung", "Giang", "Hai", "Khanh", "Lan", "Linh", "Minh", "Ngoc", "Phuc", "Quan", "Quynh", "Son", "Thao", "Trang", "Trung", "Tuan", "Vy"];
const lastNames = ["Nguyen", "Tran", "Le", "Pham", "Huynh", "Vo", "Phan", "Dang", "Bui", "Do", "Ho", "Ngo", "Duong", "Ly", "Ta", "Trinh", "Mai", "Dinh", "Cao", "Dao"];
const skills = ["Kỹ năng giảng dạy", "Giao tiếp cộng đồng", "Tổ chức sự kiện", "Công tác xã hội", "Tham vấn tâm lý", "Thuyết trình", "Lập trình cơ bản", "Quản lý nhóm", "Lãnh đạo", "Hỗ trợ hậu cần", "Chăm sóc sức khỏe cộng đồng", "Truyền thông xã hội", "Hướng dẫn kỹ năng sống", "Hỗ trợ giáo dục", "Nghiên cứu và khảo sát", "Thiết kế hoạt động", "Gây quỹ cộng đồng", "Chăm sóc trẻ", "Hỗ trợ người cao tuổi", "Bảo vệ môi trường"];
const locations = [
  "Làng Hy Vọng, Đà Nẵng",
  "Trung tâm Bảo trợ xã hội Đà Nẵng",
  "Mái ấm Hướng Dương, Đà Nẵng",
  "Làng trẻ SOS Đà Nẵng",
  "Maison Chance (Nhà May Mắn) Đà Nẵng",
  "Chùa Quang Châu, Đà Nẵng",
  "Trung tâm phụng dưỡng người già và trẻ em khó khăn",
  "Thôn Tà Lang, Hòa Bắc",
  "Thôn Giàn Bí, Hòa Bắc",
  "Xã Hòa Phú, Hòa Vang",
  "Xã Hòa Nhơn, Hòa Vang",
  "Xã Hòa Phong, Hòa Vang",
  "Xã Hòa Khương, Hòa Vang",
  "Xã Hòa Tiến, Hòa Vang",
  "Xã Mà Cooih, Đông Giang",
  "Xã A Ting, Đông Giang",
  "Xã Tư, Đông Giang",
  "Xã A Nông, Tây Giang",
  "Xã A Xan, Tây Giang",
  "Xã A Tiêng, Tây Giang",
  "Xã Chà Vàl, Nam Giang",
  "Xã La Êê, Nam Giang"
];
const jobTypes = ["Bán thời gian", "Toàn thời gian", "Tình nguyện", "Hợp đồng", "Thực tập"];
const dutyTitles = [
  "Tổ chức lớp học kỹ năng cho trẻ em Làng Hy Vọng",
  "Hỗ trợ chăm sóc trẻ đặc biệt tại Trung tâm Bảo trợ",
  "Phụ trách sinh hoạt cuối tuần tại Mái ấm Hướng Dương",
  "Kèm cặp học tập cho trẻ Làng SOS Đà Nẵng",
  "Tổ chức hoạt động thể chất cho trẻ Maison Chance",
  "Hỗ trợ bếp ăn và dinh dưỡng tại Chùa Quang Châu",
  "Thăm hỏi và chăm sóc người già neo đơn",
  "Tập huấn kỹ năng phòng chống thiên tai ở Hòa Bắc",
  "Hướng dẫn phân loại rác và bảo vệ suối ở Tà Lang",
  "Tổ chức sân chơi thiếu nhi tại Giàn Bí",
  "Khảo sát nhu cầu nước sạch tại Hòa Phú",
  "Tập huấn kỹ năng số cho thanh thiếu niên Hòa Nhơn",
  "Câu lạc bộ đọc sách lưu động ở Hòa Phong",
  "Ngày hội sức khỏe cộng đồng tại Hòa Khương",
  "Hỗ trợ tổ chức phiên chợ xanh tại Hòa Tiến",
  "Khuyến nông và vườn mẫu tại Mà Cooih",
  "Tập huấn trồng rau sạch ở A Ting",
  "Lớp tiếng Việt cho trẻ em Xã Tư",
  "Phòng chống tảo hôn tại A Nông",
  "Tổ chức giải bóng đá giao lưu tại A Xan",
  "Câu lạc bộ thiếu nhi cuối tuần ở A Tiêng",
  "Tuyên truyền sức khỏe sinh sản tại Chà Vàl",
  "Hỗ trợ sửa chữa nhà văn hóa tại La Êê"
];
const dutyDescriptions = [
  "Tuyển tình nguyện viên phối hợp giáo viên tổ chức các lớp kỹ năng sống, STEM đơn giản và trò chơi sáng tạo cho trẻ em mồ côi tại Làng Hy Vọng. Yêu cầu soạn giáo án ngắn, chuẩn bị dụng cụ và đảm bảo an toàn cho 30-40 em mỗi buổi.",
  "Cần đội ngũ hỗ trợ chăm sóc trẻ khuyết tật và hoàn cảnh đặc biệt tại Trung tâm Bảo trợ xã hội Đà Nẵng: hỗ trợ ăn uống, vật lý trị liệu nhẹ, trò chuyện giúp trẻ ổn định tâm lý; được hướng dẫn bởi nhân viên công tác xã hội.",
  "Tổ chức sinh hoạt cuối tuần cho 25 em tại Mái ấm Hướng Dương: trò chơi vận động, kể chuyện, gấp giấy, và dạy kỹ năng cá nhân (giữ vệ sinh, sắp xếp đồ dùng). Chuẩn bị kịch bản chi tiết và phân công an toàn.",
  "Hỗ trợ kèm cặp toán, tiếng Việt, tiếng Anh cơ bản cho trẻ Làng SOS Đà Nẵng (tiểu học - THCS). Mỗi ca 2 giờ, tối đa 5 em/nhóm; xây dựng kế hoạch học tập cá nhân, báo cáo tiến độ cho mẹ/nhân viên làng.",
  "Thiết kế hoạt động thể chất và trị liệu vận động nhẹ (bóng, kéo co, yoga cơ bản) cho trẻ khuyết tật nhẹ tại Maison Chance. Cần lên khung an toàn, có ít nhất 2 người hỗ trợ giám sát mỗi nhóm 8-10 em.",
  "Phụ bếp, chia khẩu phần và sắp xếp bữa trưa cho 120 suất ăn tại Chùa Quang Châu. Đảm bảo an toàn thực phẩm, vệ sinh khu bếp, hỗ trợ rửa dụng cụ và phân phát suất ăn cho người khó khăn quanh khu vực.",
  "Thăm hỏi, trò chuyện, hỗ trợ đo huyết áp, xếp thuốc theo hướng dẫn cho người già neo đơn tại Trung tâm phụng dưỡng; tổ chức hoạt động nhẹ như đọc báo, hát, tập tay chân. Cần thái độ kiên nhẫn và tôn trọng.",
  "Phối hợp Đoàn xã tập huấn kiến thức phòng chống lũ quét, dựng mô hình thoát nạn và diễn tập sơ cứu tại Hòa Bắc. Chuẩn bị tài liệu minh họa, trò chơi tương tác cho học sinh tiểu học và THCS.",
  "Hướng dẫn phân loại rác tại nguồn, thu gom rác suối và ghi nhận điểm ô nhiễm ở Tà Lang. Cần lập bản đồ điểm xả rác, chụp ảnh trước-sau, tuyên truyền hộ dân bằng tờ rơi và buổi nói chuyện ngắn.",
  "Tổ chức sân chơi cuối tuần cho thiếu nhi thôn Giàn Bí: trò chơi dân gian, vẽ tranh, chiếu phim ngắn. Chuẩn bị loa, máy chiếu, phần thưởng nhỏ; ghi nhận danh sách trẻ tham gia và đánh giá an toàn.",
  "Khảo sát 30 hộ dân ở Hòa Phú về nhu cầu nước sạch, kiểm tra giếng và bồn chứa, tổng hợp báo cáo ngắn đề xuất giải pháp. Hướng dẫn hộ dân vệ sinh bồn nước và điểm lấy nước chung.",
  "Tập huấn kỹ năng số cho thanh thiếu niên Hòa Nhơn: tạo email, bảo mật tài khoản, sử dụng công cụ học tập trực tuyến. Mỗi buổi 20-25 học viên, cần máy chiếu và 1-2 laptop dự phòng.",
  "Tổ chức câu lạc bộ đọc sách lưu động tại Hòa Phong: chọn sách thiếu nhi, hướng dẫn đọc to, thảo luận ngắn và ghi nhật ký đọc. Gợi ý góc đọc yên tĩnh, trải thảm, xếp sách gọn gàng sau buổi.",
  "Ngày hội sức khỏe cộng đồng tại Hòa Khương: hỗ trợ đo huyết áp, cân nặng, hướng dẫn dinh dưỡng, phát tờ rơi về phòng chống sốt xuất huyết. Phối hợp trạm y tế, chuẩn bị bàn ghế và nước uống.",
  "Hỗ trợ tổ chức phiên chợ xanh tại Hòa Tiến: phân khu gian hàng nông sản, thu gom rác, điều phối khách, thống kê lượng hàng bán. Nhắc nhở giảm túi nilon, ưu tiên dùng lá, hộp giấy.",
  "Khuyến nông và vườn mẫu tại Mà Cooih: cùng người dân dựng luống, ươm giống rau ngắn ngày, lắp hệ thống tưới thủ công. Ghi chép nhật ký gieo trồng và chụp ảnh tiến độ.",
  "Tập huấn trồng rau sạch ở A Ting: trình bày quy trình ủ phân hữu cơ, cách luân canh, phòng sâu bằng biện pháp sinh học. Tổ chức thực hành nhỏ tại vườn hộ gia đình.",
  "Lớp tiếng Việt cho 25 trẻ em Xã Tư: ôn chữ cái, ghép vần, luyện đọc truyện tranh. Thiết kế trò chơi chữ, thẻ flashcard, theo dõi tiến bộ hằng tuần.",
  "Phòng chống tảo hôn tại A Nông: chiếu video tuyên truyền, thảo luận nhóm với phụ huynh và thanh thiếu niên, phát tờ rơi bằng tiếng Kinh và hướng dẫn cán bộ thôn tiếp tục truyền thông.",
  "Tổ chức giải bóng đá giao lưu tại A Xan: chuẩn bị dụng cụ, kẻ sân, chia đội, đảm bảo nước uống và sơ cứu cơ bản. Ghi nhận tinh thần fair-play và chụp ảnh tư liệu.",
  "Câu lạc bộ thiếu nhi cuối tuần ở A Tiêng: kể chuyện dân gian Cơ Tu, vẽ tranh, học hát. Mỗi buổi 90 phút, cần loa nhỏ và giấy màu, bút sáp.",
  "Tuyên truyền sức khỏe sinh sản tại Chà Vàl: phối hợp trạm y tế, chuẩn bị slide, tình huống thảo luận, phát tờ rơi; tách nhóm nam/nữ vị thành niên để trao đổi riêng.",
  "Hỗ trợ sửa chữa nhà văn hóa tại La Êê: sơn lại tường, thay bóng đèn, sắp xếp bàn ghế, lắp bảng tin. Đảm bảo an toàn lao động, mang đồ bảo hộ cơ bản."
];
const requirements = [
  ["Yêu thích hoạt động cộng đồng", "Giao tiếp tốt với trẻ", "Tuân thủ kịch bản an toàn"],
  ["Kiên nhẫn với trẻ đặc biệt", "Biết lắng nghe", "Tuân thủ hướng dẫn của nhân viên trung tâm"],
  ["Kỹ năng tổ chức trò chơi", "Lên kế hoạch chi tiết", "Tinh thần trách nhiệm"],
  ["Kiến thức cơ bản Toán/Ngữ văn/Anh", "Giải thích dễ hiểu", "Báo cáo tiến độ rõ ràng"],
  ["Hiểu cơ bản về vận động trị liệu", "Cẩn thận quan sát", "Làm việc nhóm tốt"],
  ["Giữ vệ sinh an toàn thực phẩm", "Chịu khó, gọn gàng", "Lịch sự với người khó khăn"],
  ["Thái độ tôn trọng người cao tuổi", "Có thể đo huyết áp cơ bản", "Biết trao đổi nhẹ nhàng"],
  ["Kỹ năng truyền đạt đơn giản", "Không ngại di chuyển địa hình đồi núi", "Tinh thần kỷ luật"],
  ["Biết phân loại rác", "Có thể ghi chép và chụp ảnh", "Khả năng vận động nhẹ ngoài trời"],
  ["Yêu trẻ, biết tạo không khí vui", "Quản lý thời gian tốt", "Chú ý an toàn khi đông trẻ"],
  ["Biết phỏng vấn hộ dân", "Tổng hợp số liệu", "Giao tiếp lịch sự"],
  ["Kiến thức an toàn số cơ bản", "Trình bày rõ ràng", "Kiên nhẫn hỗ trợ người mới"],
  ["Yêu sách và đọc to truyền cảm", "Biết hướng dẫn thảo luận", "Sắp xếp không gian gọn gàng"],
  ["Hiểu cơ bản về sức khỏe cộng đồng", "Có thể hướng dẫn đo huyết áp", "Tương tác thân thiện"],
  ["Khả năng sắp xếp gian hàng", "Giao tiếp với người dân", "Ý thức bảo vệ môi trường"],
  ["Sức khỏe tốt", "Chịu khó lao động ngoài trời", "Ghi chép nhật ký vườn"],
  ["Kiến thức nông nghiệp hữu cơ cơ bản", "Giải thích dễ hiểu", "Hỗ trợ thực hành"],
  ["Phát âm chuẩn tiếng Việt", "Tạo trò chơi chữ", "Kiên nhẫn với trẻ chậm"],
  ["Kỹ năng thuyết trình", "Hiểu văn hóa địa phương", "Tôn trọng khác biệt"],
  ["Tổ chức sự kiện nhỏ", "Hiểu luật chơi cơ bản", "Chủ động xử lý tình huống"],
  ["Kể chuyện, vẽ tranh", "Tạo không khí thân thiện", "Kiểm soát thời lượng"],
  ["Kiến thức sức khỏe sinh sản vị thành niên", "Trình bày tế nhị", "Làm việc với cán bộ y tế"],
  ["Biết sơn sửa cơ bản", "Tuân thủ an toàn lao động", "Phối hợp nhóm"]
];
const organizationNames = [
  "Làng Hy Vọng Đà Nẵng",
  "Trung tâm Bảo trợ xã hội Đà Nẵng",
  "Mái ấm Hướng Dương",
  "Làng trẻ SOS Đà Nẵng",
  "Maison Chance Đà Nẵng",
  "Chùa Quang Châu",
  "Trung tâm phụng dưỡng người già và trẻ em khó khăn",
  "Cộng đồng Hòa Bắc",
  "Cộng đồng Hòa Vang",
  "Cộng đồng vùng cao Quảng Nam"
];
const organizationDescriptions = [
  "Nơi chăm sóc và giáo dục trẻ mồ côi, tổ chức lớp kỹ năng sống, hỗ trợ học tập, hướng nghiệp và tạo môi trường an toàn cho các em.",
  "Cơ sở bảo trợ trẻ em và người yếu thế tại Đà Nẵng, cung cấp dịch vụ chăm sóc, phục hồi chức năng, tư vấn và kết nối nguồn lực xã hội.",
  "Mái ấm dành cho trẻ em hoàn cảnh đặc biệt, tập trung nuôi dưỡng, dạy kỹ năng tự lập và hỗ trợ hòa nhập cộng đồng.",
  "Hệ thống gia đình thay thế cho trẻ em mồ côi, đảm bảo giáo dục, chăm sóc toàn diện và các hoạt động phát triển cá nhân.",
  "Tổ chức hỗ trợ trẻ khuyết tật và hoàn cảnh khó khăn, cung cấp chỗ ở, phục hồi chức năng, dạy nghề và hòa nhập lao động.",
  "Cơ sở tôn giáo kết hợp hoạt động thiện nguyện: bếp ăn từ thiện, tặng quà, hỗ trợ người vô gia cư và trẻ em thiếu thốn.",
  "Nơi chăm sóc người già neo đơn và trẻ em khó khăn, chú trọng sức khỏe tinh thần, dinh dưỡng và kết nối tình nguyện viên.",
  "Mạng lưới cộng đồng ở Hòa Bắc, tập trung bảo tồn văn hóa Cơ Tu, bảo vệ môi trường và phát triển sinh kế bền vững.",
  "Cộng đồng Hòa Vang với nhiều chương trình y tế, giáo dục, bảo vệ môi trường và phát triển nông nghiệp sạch.",
  "Mạng lưới hỗ trợ các xã miền núi Quảng Nam: giáo dục, y tế dự phòng, giảm nghèo, bảo tồn văn hóa Cơ Tu - Ve."
];
const websites = [
  "https://langhyvong.example.org",
  "https://baotroxahoi.danang.example.org",
  "https://huongduong.example.org",
  "https://sosdanang.example.org",
  "https://maisonchance.example.org",
  "https://quangchau.example.org",
  "https://phungduong.example.org",
  "https://hoabac.example.org",
  "https://hoavang.example.org",
  "https://quangnamcao.example.org"
];
const postContents = [
  "Cảm ơn mọi người đã tham gia buổi sinh hoạt hôm nay, các em rất hào hứng!",
  "Cuối tuần này chúng ta dạy kỹ năng phòng chống đuối nước, nhớ mang áo mưa nhẹ.",
  "Nhóm đã hoàn thành 20 suất quà cho bà con, mai sẽ phát tại Hòa Bắc.",
  "Các em ở Làng Hy Vọng tiến bộ rõ rệt, cảm ơn thầy cô và TNV.",
  "Ngày hội đọc sách lưu động thành công, 35 em tham gia và mượn sách về nhà.",
  "Đã lắp xong 5 bồn rửa tay tại trường, nhờ cả nhà kiểm tra giúp.",
  "Hội thảo phòng chống tảo hôn rất sôi nổi, nhiều câu hỏi thực tế.",
  "Chuyến khảo sát nước sạch Hòa Phú hoàn thành, sẽ tổng hợp báo cáo.",
  "Tập huấn trồng rau hữu cơ tại A Ting có 18 hộ tham gia, phản hồi tốt.",
  "Nhà văn hóa La Êê đã sơn mới xong mặt trước, nhìn sáng sủa hơn nhiều."
];
const commentContents = [
  "Công nhận buổi hôm nay vui quá!",
  "Mình tham gia thêm ca chiều nhé.",
  "Cảm ơn mọi người đã chuẩn bị rất kỹ.",
  "Nhờ gửi thêm hình ảnh để báo cáo.",
  "Các em chăm chỉ, đáng khen lắm.",
  "Tài liệu phòng chống tảo hôn rất dễ hiểu.",
  "Tuần sau mình mang thêm sách truyện.",
  "Sân chơi cần thêm bóng, mình sẽ mua.",
  "Rất vui khi thấy bà con ủng hộ.",
  "Chúng ta cố gắng duy trì đều nhé!"
];
const imageUrls = [
  "https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-ta-van-sapa/36469903110_7abe15aa4f_k-2/",
  "https://archive.veo.com.vn/tour/du-lich-cong-dong-lang-van-hoa-khmer-tra-vinh/ve%CC%83-scaled-2/",
  "https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-van-ho-son-la/processed-with-vsco-with-6-preset-3/",
  "https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-lo-lo-chai/du-lich-cong-dong-tai-ha-giang-1/",
  "https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-ta-van-sapa/36469903110_7abe15aa4f_k-2/",
  "https://archive.veo.com.vn/tour/phat-trien-du-lich-cong-dong-tai-lo-lo-chai/du-lich-cong-dong-tai-ha-giang-1/",
  "https://archive.veo.com.vn/tour/du-lich-cong-dong-da-phuoc-an-giang/51013651255_a22c6b0d8e_k/",
  "https://archive.veo.com.vn/tour/du-lich-tinh-nguyen-mai-chau/mai-cha%CC%82u/",
  "https://archive.veo.com.vn/tour/du-lich-tinh-nguyen-ma-bo-lam-dong/processed-with-vsco-with-6-preset-2/"
];

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};
const getRandomPhone = () => Math.floor(1000000000 + Math.random() * 9000000000);

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Duty.deleteMany({});
    await Application.deleteMany({});
    await Group.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = [];

    // Create admin user
    const adminUser = await User.create({
      fullname: "Admin User",
      email: "admin@changemakers.com",
      phoneNumber: 1234567890,
      password: hashedPassword,
      role: "admin",
      profile: {
        bio: "Administrator of Change Makers platform",
        skills: ["Management", "Leadership"],
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    });
    users.push(adminUser);

    // Create 19 regular users
    const usedEmails = new Set();
    for (let i = 0; i < 19; i++) {
      let firstName, lastName, email;
      let attempts = 0;

      // Ensure unique email
      do {
        firstName = getRandomElement(firstNames);
        lastName = getRandomElement(lastNames);
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@gmail.com`;
        attempts++;
      } while (usedEmails.has(email) && attempts < 100);

      usedEmails.add(email);

      const user = await User.create({
        fullname: `${firstName} ${lastName}`,
        email: email,
        phoneNumber: getRandomPhone(),
        password: hashedPassword,
        role: "user",
        profile: {
          bio: `${getRandomElement(["Passionate volunteer", "Community advocate", "Social worker", "Educator", "Environmentalist"])} looking to make a difference`,
          skills: getRandomElements(skills, Math.floor(Math.random() * 4) + 2),
          profilePhoto: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
        },
      });
      users.push(user);
    }

    // Create organizations
    console.log("Creating organizations...");
    const organizations = [];
    for (let i = 0; i < 10; i++) {
      // First 3 organizations are owned by admin, rest by random users
      const orgOwner = i < 3 ? adminUser : users[Math.floor(Math.random() * 19) + 1];
      const org = await Organization.create({
        name: organizationNames[i],
        description: organizationDescriptions[i],
        website: websites[i],
        location: getRandomElement(locations),
        logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200",
        userId: orgOwner._id,
      });
      organizations.push(org);
    }

    // Create duties
    console.log("Creating duties...");
    const duties = [];
    // Get admin-owned organizations (first 3)
    const adminOrganizations = organizations.slice(0, 3);

    for (let i = 0; i < 30; i++) {
      // First 10 duties are created by admin (using admin organizations)
      // Rest are created by random users
      let org, orgOwner;
      if (i < 10) {
        // Admin duties - use admin organizations
        org = getRandomElement(adminOrganizations);
        orgOwner = adminUser;
      } else {
        // Regular user duties
        org = getRandomElement(organizations);
        orgOwner = users.find(u => u._id.toString() === org.userId.toString()) || users[1];
      }

      // Generate dates for upcoming events
      const daysUntilStart = Math.floor(Math.random() * 14) + 1; // 1-14 days
      const startDate = getRandomDate(daysUntilStart);
      const endDate = getRandomDate(daysUntilStart + Math.floor(Math.random() * 30) + 7); // 7-37 days from start
      const daysUntilDeadline = Math.floor(Math.random() * 7) + 1; // 1-7 days
      const deadline = getRandomDate(daysUntilDeadline);

      const duty = await Duty.create({
        tittle: dutyTitles[i % dutyTitles.length],
        description: dutyDescriptions[i % dutyDescriptions.length],
        requirements: getRandomElement(requirements),
        workDuration: Math.floor(Math.random() * 12) + 3, // 3-15 hours
        experienceLevel: Math.floor(Math.random() * 3) + 1, // 1-3
        location: getRandomElement(locations),
        jobType: getRandomElement(jobTypes),
        position: Math.floor(Math.random() * 10) + 1, // 1-10 positions
        organization: org._id,
        created_by: orgOwner._id,
        applications: [],
        startDate: startDate,
        endDate: endDate,
        deadline: deadline,
        images: [getRandomElement(imageUrls), getRandomElement(imageUrls)],
        isOpen: Math.random() > 0.1, // 90% open
      });
      duties.push(duty);
    }

    // Create applications
    console.log("Creating applications...");
    const applications = [];
    const statuses = ["pending", "accepted", "rejected"];

    for (let i = 0; i < 50; i++) {
      const duty = getRandomElement(duties);
      const applicant = getRandomElement(users.filter(u => u.role === "user"));
      const status = getRandomElement(statuses);

      const application = await Application.create({
        duty: duty._id,
        applicant: applicant._id,
        status: status,
      });
      applications.push(application);

      // Update duty with application
      await Duty.findByIdAndUpdate(duty._id, {
        $push: { applications: application._id },
      });
    }

    // Create groups for duties with accepted applications
    console.log("Creating groups...");
    const groups = [];
    const dutiesWithAcceptedApps = duties.filter(duty => {
      const dutyApps = applications.filter(app =>
        app.duty.toString() === duty._id.toString() && app.status === "accepted"
      );
      return dutyApps.length > 0;
    });

    for (const duty of dutiesWithAcceptedApps) {
      const acceptedApps = applications.filter(app =>
        app.duty.toString() === duty._id.toString() && app.status === "accepted"
      );
      const members = acceptedApps.map(app => app.applicant);

      const group = await Group.create({
        duty: duty._id,
        name: `${duty.tittle} - Group`,
        description: `Group for ${duty.tittle} volunteers`,
        members: members,
        created_by: duty.created_by,
      });
      groups.push(group);
    }

    // Create posts for groups
    console.log("Creating posts...");
    const posts = [];
    for (let i = 0; i < 30; i++) {
      const group = getRandomElement(groups);
      const author = getRandomElement(group.members);

      const post = await Post.create({
        group: group._id,
        author: author,
        content: getRandomElement(postContents),
        images: Math.random() > 0.7 ? [getRandomElement(imageUrls)] : [],
        likes: getRandomElements(group.members, Math.floor(Math.random() * group.members.length)),
        shares: getRandomElements(group.members, Math.floor(Math.random() * 3)),
        comments: [],
      });
      posts.push(post);
    }

    // Create comments for posts
    console.log("Creating comments...");
    for (let i = 0; i < 50; i++) {
      const post = getRandomElement(posts);
      const group = groups.find(g => g._id.toString() === post.group.toString());
      if (!group || group.members.length === 0) continue;

      const author = getRandomElement(group.members);

      const comment = await Comment.create({
        post: post._id,
        author: author,
        content: getRandomElement(commentContents),
        likes: getRandomElements(group.members, Math.floor(Math.random() * 3)),
        replies: [],
        parentComment: null,
      });

      // Update post with comment
      await Post.findByIdAndUpdate(post._id, {
        $push: { comments: comment._id },
      });
    }

    // Count admin-created items
    const adminOrgCount = await Organization.countDocuments({ userId: adminUser._id });
    const adminDutyCount = await Duty.countDocuments({ created_by: adminUser._id });

    console.log("\n✅ Seed data created successfully!");
    console.log("\n📊 Created:");
    console.log(`   - ${await User.countDocuments()} users (1 admin, ${await User.countDocuments({ role: "user" })} regular)`);
    console.log(`   - ${await Organization.countDocuments()} organizations (${adminOrgCount} by admin, ${await Organization.countDocuments() - adminOrgCount} by users)`);
    console.log(`   - ${await Duty.countDocuments()} duties (${adminDutyCount} by admin, ${await Duty.countDocuments() - adminDutyCount} by users)`);
    console.log(`   - ${await Application.countDocuments()} applications`);
    console.log(`   - ${await Group.countDocuments()} groups`);
    console.log(`   - ${await Post.countDocuments()} posts`);
    console.log(`   - ${await Comment.countDocuments()} comments`);
    console.log("\n🔑 Default credentials:");
    console.log("   Email: admin@changemakers.com");
    console.log("   Password: password123");
    console.log("\n   All other users: password123");
    console.log("   Email format: firstname.lastname@example.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
