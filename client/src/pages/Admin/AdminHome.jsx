import React, { useContext } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const AdminHome = () => {
  const { logout } = useContext(AppContext)
  const navigate = useNavigate()

  const menuItems = [
    { title: 'Bảng điều khiển', path: '/dashboard-admin', icon: '📊', end: true },
    { title: 'Quản lý tài khoản', path: '/dashboard-admin/list-account', icon: '👥' },
    { title: 'Quản lý ngành nghề', path: '/dashboard-admin/list-industry', icon: '📁' },
    { title: 'Danh sách ứng tuyển', path: '/dashboard-admin/list-apply', icon: '📝' },
    { title: 'Quản lý gói tin', path: '/dashboard-admin/list-package', icon: '💳' },
  ]

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* SIDEBAR BÊN TRÁI */}
      <div className='w-72 bg-white shadow-xl flex flex-col fixed h-full'>
        <div className='p-8 border-b'>
          <h1 className='text-2xl font-black text-blue-600 tracking-tighter'>
            Bot<span className='text-gray-800'>CV</span> <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-1'>ADMIN</span>
          </h1>
        </div>

        <nav className='flex-1 p-4 space-y-1 mt-4'>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              <span className='text-xl'>{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className='p-4 border-t'>
          <button 
            onClick={() => { logout(); navigate('/') }}
            className='flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors'
          >
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </div>

      {/* NỘI DUNG BÊN PHẢI (Sẽ hiển thị AdminDashBoard, AdminIndustry... tại đây) */}
      <div className='flex-1 ml-72'>
        <header className='h-20 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10 flex items-center justify-between px-8'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-400'>Trang quản trị</span>
            <span className='text-gray-300'>/</span>
            <span className='font-medium text-gray-700 uppercase tracking-wider text-sm'>Hệ thống</span>
          </div>
          
          <div className='flex items-center gap-4'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold text-gray-800'>Quản trị viên</p>
              <p className='text-xs text-green-500 font-medium'>Đang hoạt động</p>
            </div>
            <div className='w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
              AD
            </div>
          </div>
        </header>

        <main className='p-8'>
          {/* Outlet là nơi render các Route con trong App.jsx */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminHome