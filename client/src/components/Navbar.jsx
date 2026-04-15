import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  const { token, userData, role, logout } = useContext(AppContext)

  return (
    <div className='shadow py-4 bg-white sticky top-0 z-50'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        
        {/* Logo */}
        <h1 
          onClick={() => navigate('/')} 
          className='text-2xl font-bold text-blue-600 cursor-pointer tracking-tighter'
        >
          Bot<span className='text-gray-800'>CV</span>
        </h1>

        <div className='flex items-center gap-4'>
          {/* Menu điều hướng dựa trên Role */}
          {token && userData && (
            <div className='hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-gray-600'>
              {role === 'user' && (
                <>
                  <p onClick={() => navigate('/applied-jobs')} className='cursor-pointer hover:text-blue-600'>Việc đã ứng tuyển</p>
                  <p onClick={() => navigate('/saved-jobs')} className='cursor-pointer hover:text-blue-600'>Việc đã lưu</p>
                </>
              )}
              {role === 'recruiter' && (
                <>
                  <p onClick={() => navigate('/dashboard')} className='cursor-pointer hover:text-blue-600 font-bold text-blue-600'>Bảng điều khiển</p>
                  <p onClick={() => navigate('/dashboard/add-job')} className='cursor-pointer hover:text-blue-600'>Đăng tin mới</p>
                </>
              )}
              {role === 'admin' && (
                <p onClick={() => navigate('/admin-panel')} className='cursor-pointer text-red-600 font-bold'>Quản trị hệ thống</p>
              )}
            </div>
          )}

          {/* Phần Account: Login hoặc User Info */}
          {token && userData ? (
            <div className='flex items-center gap-3 group relative'>
              <div className='text-right hidden sm:block'>
                <p className='text-gray-800 font-bold leading-none'>
                  {/* Hiển thị name nếu là user, hiển thị companyName nếu là recruiter */}
                  {userData.name || userData.companyName}
                </p>
                <p className='text-[10px] uppercase tracking-widest text-blue-500 font-bold mt-1'>
                  {role}
                </p>
              </div>
              
              <div className='w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold shadow-md cursor-pointer border-2 border-white group-hover:border-blue-100 transition-all'>
                {/* FIX LỖI charAt: Kiểm tra an toàn cho cả name và companyName */}
                {(userData?.name?.charAt(0) || userData?.companyName?.charAt(0) || "U").toUpperCase()}
              </div>

              {/* Dropdown Menu */}
              <div className='absolute top-full right-0 pt-2 hidden group-hover:block z-50 animate-fadeIn'>
                <div className='bg-white border border-gray-100 rounded-lg shadow-2xl py-2 w-48 overflow-hidden'>
                  <div className='px-4 py-2 border-b border-gray-50 mb-1'>
                    <p className='text-xs text-gray-400 uppercase font-bold'>Tài khoản</p>
                  </div>
                  
                  {role === 'user' && (
                    <p onClick={() => navigate('/profile')} className='px-4 py-2 hover:bg-blue-50 text-gray-700 cursor-pointer text-sm transition-colors'>
                      Hồ sơ cá nhân
                    </p>
                  )}

                  <p 
                    onClick={logout} 
                    className='px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer text-sm font-bold transition-colors border-t mt-1'
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <p 
                onClick={() => navigate('/recruiter-login')} 
                className='hidden md:block text-gray-600 cursor-pointer hover:text-blue-600 text-sm font-medium mr-2'
              >
                Nhà tuyển dụng?
              </p>
              <button 
                onClick={() => setShowLogin(true)} 
                className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700 transition-all font-medium shadow-md active:scale-95'
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar