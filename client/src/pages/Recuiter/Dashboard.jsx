import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, Briefcase, Settings } from 'lucide-react'; // Import icon

const Dashboard = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar (Menu bên trái) */}
      <div className="w-full md:w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-black text-blue-600 tracking-tight">Khu vực quản lý</h2>
        </div>
        
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
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

      {/* Main Content (Khu vực hiển thị nội dung bên phải) */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
         {/* <Outlet /> chính là nơi các trang con sẽ hiển thị (như DashboardHome, ViewApplication...) */}
         <Outlet /> 
      </div>

    </div>
  );
}

export default Dashboard;