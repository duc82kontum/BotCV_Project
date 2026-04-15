import React from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // Logic hiển thị lương dựa trên JobModel.js
  const displaySalary = job.salary?.negotiable 
    ? "Thỏa thuận" 
    : `${job.salary?.min} - ${job.salary?.max} triệu`;

  // Format lại đường dẫn ảnh từ Backend (xử lý dấu gạch chéo ngược)
  const logoUrl = job.recruiter?.logo 
    ? `http://localhost:5000/${job.recruiter.logo.replace(/\\/g, "/")}` 
    : null;

  return (
    <div 
      onClick={() => navigate(`/apply-job/${job._id}`)}
      className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Hiệu ứng trang trí góc card */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
          ) : (
            <Briefcase className="text-blue-500" size={28} />
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase tracking-wider">
            {job.type || 'On-site'}
            </span>
            <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg uppercase tracking-wider">
            {job.level}
            </span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {job.title}
        </h3>
        <p className="text-blue-500 font-medium text-sm mb-4">
          {job.recruiter?.companyName || 'Công ty chưa cập nhật'}
        </p>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="flex items-center text-gray-500 text-xs">
            <MapPin size={14} className="mr-1.5 text-gray-400" />
            <span className="truncate">{job.district}, {job.provinceCode}</span>
          </div>
          <div className="flex items-center text-green-600 text-xs font-bold">
            <DollarSign size={14} className="mr-1.5" />
            {displaySalary}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={14} className="mr-1.5 text-gray-400" />
            {job.experiences}
          </div>
          <div className="flex items-center text-red-500 text-xs font-medium">
            <Calendar size={14} className="mr-1.5" />
            Hạn: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-2.5 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 font-bold rounded-xl transition-all duration-300 border border-blue-50 group-hover:border-transparent flex items-center justify-center gap-2">
        Xem chi tiết
        <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
            →
        </div>
      </button>
    </div>
  );
};

export default JobCard;