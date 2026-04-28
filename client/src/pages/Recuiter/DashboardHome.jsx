import React from 'react';
import { Users, Briefcase, Eye } from 'lucide-react';

const DashboardHome = () => {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan tuyển dụng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Briefcase size={28} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Chiến dịch đang mở</p>
            <p className="text-2xl font-black text-gray-800">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Hồ sơ ứng viên mới</p>
            <p className="text-2xl font-black text-gray-800">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Eye size={28} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Lượt xem công ty</p>
            <p className="text-2xl font-black text-gray-800">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;