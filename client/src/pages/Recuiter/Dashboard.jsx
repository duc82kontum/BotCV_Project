import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, Briefcase, Home, LogOut } from 'lucide-react'; 
import { AppContext } from '../../context/AppContext'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { setToken, logout } = useContext(AppContext) || {};

  const handleLogout = () => {
    // Sử dụng hàm logout từ Context để đảm bảo xóa sạch token/role/userData
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (setToken) setToken('');
    }
    
    navigate('/');
    window.location.reload();
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar (Menu bên trái) */}
      <div className="w-full md:w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col justify-between sticky top-0 h-screen">
        
        <div className="p-6">
            {/* Logo hoặc Tên Dashboard */}
            <div onClick={goToHome} className="flex items-center gap-2 mb-8 cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                <span className="text-xl font-black text-gray-800 tracking-tighter">DASHBOARD</span>
            </div>

            {/* Điều hướng Menu */}
            <nav className="space-y-2">
            <NavLink 
                to="/dashboard" 
                end
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <LayoutDashboard size={20} /> <span className="hidden md:inline">Tổng quan</span>
            </NavLink>

            {/* MỤC MỚI: HỒ SƠ CÔNG TY */}
            <NavLink 
                to="/dashboard/company-profile" 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <Users size={20} /> <span className="hidden md:inline">Hồ sơ công ty</span>
            </NavLink>

            <NavLink 
                to="/dashboard/view-applications" 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
            >
                <Users size={20} /> <span className="hidden md:inline">Danh sách ứng tuyển</span>
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

        {/* Phần tiện ích phía dưới cùng của Sidebar */}
        <div className="p-4 border-t border-gray-100 space-y-2">
            <button 
                onClick={goToHome} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 font-bold transition-all"
            >
                <Home size={20} /> <span className="hidden md:inline">Về trang chủ</span>
            </button>
            
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold transition-all"
            >
                <LogOut size={20} /> <span className="hidden md:inline">Đăng xuất</span>
            </button>
        </div>
      </div>

      {/* Main Content (Nội dung bên phải) */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
             <Outlet />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;