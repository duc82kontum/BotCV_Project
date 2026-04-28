import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Sử dụng icon từ thư viện bạn đang dùng

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // Logic quay lại trang trước đó trong lịch sử trình duyệt
      className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all font-medium py-2 px-1 ${className}`}
    >
      <ArrowLeft size={20} />
      <span>Quay lại</span>
    </button>
  );
};

export default BackButton;