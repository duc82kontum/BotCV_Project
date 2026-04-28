import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, Briefcase, Home, LogOut } from 'lucide-react'; 
import { AppContext } from '../../context/AppContext'; // Import context nếu cần gọi hàm logout, hoặc tự xử lý

const Dashboard = () => {
  const navigate = useNavigate();
  // Lấy hàm setToken hoặc các state cần thiết để clear khi đăng xuất (Tùy thuộc vào AppContext của bạn)
  const { setToken } = useContext(AppContext) || {};

  const handleLogout = () => {
    // 1. Xóa token trong bộ nhớ
    localStorage.removeItem('token');
    localStorage.removeItem('companyToken');
    if (setToken) setToken('');
    
    // 2. Chuyển hướng về trang chủ và tải lại trang để clear toàn bộ state
    navigate('/');
    window.location.reload();
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar (Menu bên trái) */}
      <div className="w-full md:w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col justify-between">
        
        {/* Phần Menu phía trên */}
        <div>
            <div className="p-6 border-b border-gray-100 hidden md:block">
            <h2 className="text-xl font-black text-blue-600 tracking-tight">Khu vực quản lý</h2>
            </div>
            
            <nav className="p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            <NavLink 
                to="/dashboard" 
                end 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <LayoutDashboard size={20} /> <span className="hidden md:inline">Tổng quan</span>
            </NavLink>
            
            <NavLink 
                to="/dashboard/view-applications" 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <Users size={20} /> <span className="hidden md:inline">Quản lý ứng viên</span>
            </NavLink>

            <NavLink 
                to="/dashboard/add-job" 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <FilePlus size={20} /> <span className="hidden md:inline">Đăng tin mới</span>
            </NavLink>

            <NavLink 
                to="/dashboard/manage-jobs" 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <Briefcase size={20} /> <span className="hidden md:inline">Quản lý tin đăng</span>
            </NavLink>
            </nav>
        </div>

        {/* PHẦN MỚI THÊM: Tiện ích phía dưới cùng của Sidebar */}
        <div className="p-4 border-t border-gray-100 space-y-2 hidden md:block">
            <button 
                onClick={goToHome} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all"
            >
                <Home size={20} /> <span>Về trang chủ</span>
            </button>
            
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold transition-all"
            >
                <LogOut size={20} /> <span>Đăng xuất</span>
            </button>
        </div>

      </div>

      {/* Main Content (Khu vực hiển thị nội dung bên phải) */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
         <Outlet /> 
      </div>

    </div>
  );
}

export default Dashboard;