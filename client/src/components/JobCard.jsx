import React from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // 1. Xử lý hiển thị lương an toàn
  const getSalaryDisplay = () => {
    if (job.salary?.negotiable) return "Thỏa thuận";
    if (job.salary?.min && job.salary?.max) {
      return `${job.salary.min} - ${job.salary.max} triệu`;
    }
    return "Lương hấp dẫn";
  };

  /**
   * 2. Logic nạp Logo từ thư mục assets
   * Chúng ta sẽ ưu tiên kiểm tra trường 'logoName' trong DB (ví dụ: "logo1.jpg")
   * Nếu không có, nó sẽ kiểm tra logo từ Backend như cũ.
   */
  const getLogoUrl = () => {
    if (job.logoName) {
      // Nạp ảnh trực tiếp từ thư mục assets/logo cong ty
      try {
        return new URL(`../assets/logo cong ty/${job.logoName}`, import.meta.url).href;
      } catch (err) {
        console.error("Không tìm thấy file logo:", job.logoName);
        return null;
      }
    }
    
    // Nếu không có logoName, kiểm tra logo từ dữ liệu recruiter (Backend)
    if (job.recruiter?.logo) {
      return job.recruiter.logo.startsWith('http') 
        ? job.recruiter.logo 
        : `http://localhost:5000/${job.recruiter.logo.replace(/\\/g, "/")}`;
    }
    
    return null;
  };

  const logoUrl = getLogoUrl();

  // 3. Format ngày tháng an toàn hỗ trợ định dạng MongoDB $date
  const formatDeadline = (dateInput) => {
    if (!dateInput) return 'N/A';
    const date = dateInput.$date ? new Date(dateInput.$date) : new Date(dateInput);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
  };

  return (
    <div 
      onClick={() => navigate(`/apply-job/${job._id}`)}
      className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Hiệu ứng trang trí góc card */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        {/* Logo Công ty: Hiển thị ảnh từ assets hoặc icon mặc định */}
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <Briefcase className="text-blue-500" size={28} />
          )}
        </div>
        
        {/* Tags: Loại hình và Cấp bậc */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase tracking-wider">
            {job.type || 'On-site'}
          </span>
          {job.level && (
            <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg uppercase tracking-wider">
              {job.level}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10">
        {/* Tiêu đề công việc */}
        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {job.title || 'Vị trí chưa xác định'}
        </h3>
        
        {/* Tên công ty */}
        <p className="text-blue-500 font-medium text-sm mb-4 truncate">
          {job.recruiter?.companyName || 'BotCV Partner'}
        </p>

        {/* Thông tin chi tiết Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="flex items-center text-gray-500 text-xs">
            <MapPin size={14} className="mr-1.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.district || 'Liên hệ'}, {job.provinceCode || 'Toàn quốc'}</span>
          </div>
          
          <div className="flex items-center text-green-600 text-xs font-bold">
            <DollarSign size={14} className="mr-1.5 shrink-0" />
            <span className="truncate">{getSalaryDisplay()}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={14} className="mr-1.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.experiences || 'Chưa yêu cầu'}</span>
          </div>
          
          <div className="flex items-center text-red-500 text-xs font-medium">
            <Calendar size={14} className="mr-1.5 shrink-0" />
            <span className="truncate">Hạn: {formatDeadline(job.deadline)}</span>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-2.5 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 font-bold rounded-xl transition-all duration-300 border border-blue-50 group-hover:border-transparent flex items-center justify-center gap-2">
        Xem chi tiết
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
};

export default JobCard;