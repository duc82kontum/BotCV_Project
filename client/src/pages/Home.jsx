import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Hero from '../components/Hero';
import JobList from '../components/JobList';
import { Briefcase, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const { backendUrl } = useContext(AppContext);
  const [industries, setIndustries] = useState([]);

  // Lấy dữ liệu ngành nghề thực tế từ hệ thống quản trị[cite: 16]
  const fetchIndustries = async () => {
    try {
      // Đã sửa: Gọi API công khai không cần gửi kèm token Admin[cite: 16]
      const { data } = await axios.get(`${backendUrl}/api/admin/list-industry`);
      if (data.success) {
        setIndustries(data.data.slice(0, 8)); // Hiển thị 8 ngành nổi bật[cite: 16]
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục ngành nghề ở trang chủ");
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />

      {/* 2. Phần Stats nhanh (Tạo độ uy tín)[cite: 16] */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-10 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-100 mx-4">
        <div className="text-center border-r border-white/20">
          <h3 className="text-3xl font-black italic">100K+</h3>
          <p className="text-xs uppercase font-bold opacity-80">Ứng viên</p>
        </div>
        <div className="text-center border-r border-white/20">
          <h3 className="text-3xl font-black italic">5K+</h3>
          <p className="text-xs uppercase font-bold opacity-80">Công ty</p>
        </div>
        <div className="text-center border-r border-white/20">
          <h3 className="text-3xl font-black italic">20K+</h3>
          <p className="text-xs uppercase font-bold opacity-80">Việc làm</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-black italic">500+</h3>
          <p className="text-xs uppercase font-bold opacity-80">Ngành nghề</p>
        </div>
      </div>

      {/* 3. Danh mục ngành nghề nổi bật (Lấy từ dữ liệu Admin)[cite: 16] */}
      <section className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Top Ngành Nghề Nổi Bật</h2>
          <p className="text-gray-400 font-medium italic">Tiếp cận cơ hội việc làm theo từng lĩnh vực chuyên môn</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.length > 0 ? industries.map((item, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase size={24} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors uppercase">{item.name}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khám phá cơ hội</p>
            </div>
          )) : (
            <div className="col-span-full py-10 text-center text-gray-400 italic">Đang tải danh mục ngành nghề...</div>
          )}
        </div>
      </section>

      {/* 4. Danh sách việc làm mới nhất[cite: 16] */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Việc làm tốt nhất</h2>
            <p className="text-gray-400 font-medium italic">Những vị trí tuyển dụng hấp dẫn nhất dành cho bạn</p>
          </div>
        </div>
        <JobList /> 
      </section>

      {/* 5. Section Tính năng (Tại sao chọn BotCV)[cite: 16] */}
      <section className="bg-gray-50 py-20 px-4 rounded-[3rem]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="text-blue-600 mb-4" size={40} />
            <h4 className="text-lg font-black uppercase text-gray-800 mb-2">Đề xuất AI</h4>
            <p className="text-sm text-gray-500 font-medium">Gợi ý việc làm phù hợp dựa trên kỹ năng và hồ sơ.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="text-green-600 mb-4" size={40} />
            <h4 className="text-lg font-black uppercase text-gray-800 mb-2">Hồ sơ uy tín</h4>
            <p className="text-sm text-gray-500 font-medium">Hệ thống doanh nghiệp được xác thực minh bạch.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="text-amber-500 mb-4" size={40} />
            <h4 className="text-lg font-black uppercase text-gray-800 mb-2">Ứng tuyển nhanh</h4>
            <p className="text-sm text-gray-500 font-medium">Nộp CV trực tiếp chỉ với 1 click chuột tiện lợi.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;