import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  
  // Lấy các dữ liệu cần thiết từ Context
  const { token, userData, role, logout, applyCount, savedCount } = useContext(AppContext)

  // Hàm lấy chữ cái đầu tiên của tên người dùng
  const getUserInitial = () => {
    if (userData && userData.fullName) {
      return userData.fullName.charAt(0).toUpperCase();
    }
    if (userData && userData.name) {
        return userData.name.charAt(0).toUpperCase();
    }
    if (role === 'admin') return 'A'; // Phân biệt riêng chữ A cho Admin nếu không có tên
    return 'U';
  };

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
          
          {/* PHẦN LOGIC HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP (Nhận diện đủ token và userData) */}
          {token && userData ? (
            <div className='flex items-center gap-4'>
              
              {/* 1. NÚT ĐIỀU HƯỚNG NHANH THEO ROLE */}
              {role === 'recruiter' && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className='hidden md:block bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-100 transition-all border border-blue-100'
                >
                  Quản lý tuyển dụng
                </button>
              )}
              
              {role === 'admin' && (
                <button 
                  onClick={() => navigate('/dashboard-admin')}
                  className='hidden md:block bg-purple-50 text-purple-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-purple-100 transition-all border border-purple-100'
                >
                  Quản trị hệ thống
                </button>
              )}

              {/* 2. MENU ĐIỀU HƯỚNG CHO USER */}
              {role === 'user' && (
                <div className='hidden lg:flex items-center gap-6 mr-4'>
                  <p onClick={() => navigate('/applications')} className='text-gray-600 cursor-pointer hover:text-blue-600 text-sm font-medium'>
                    Đã ứng tuyển ({applyCount || 0})
                  </p>
                  <p onClick={() => navigate('/saved-jobs')} className='text-gray-600 cursor-pointer hover:text-blue-600 text-sm font-medium'>
                    Đã lưu ({savedCount || 0})
                  </p>
                </div>
              )}

              {/* 3. AVATAR & DROPDOWN MENU CHUNG */}
              <div className='group relative flex items-center gap-2 cursor-pointer'>
                <div className='w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm'>
                  {getUserInitial()}
                </div>
                
                <div className='hidden sm:block'>
                   <p className='text-[10px] text-gray-400 font-bold leading-none uppercase'>{role}</p>
                   <p className='text-xs font-bold text-gray-700 truncate max-w-[100px]'>
                     {userData.fullName || userData.name || (role === 'admin' ? 'Admin' : 'Tài khoản')}
                   </p>
                </div>

                {/* Dropdown Box */}
                <div className='absolute top-full right-0 pt-3 hidden group-hover:block z-50'>
                  <div className='bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden min-w-[200px]'>
                    
                    {/* Mục menu riêng cho từng Role */}
                    {role === 'recruiter' && (
                      <p onClick={() => navigate('/dashboard')} className='px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer text-sm font-medium border-b border-gray-50'>
                        Vào trang Dashboard
                      </p>
                    )}
                    
                    {role === 'admin' && (
                      <p onClick={() => navigate('/dashboard-admin')} className='px-4 py-3 hover:bg-purple-50 text-gray-700 cursor-pointer text-sm font-medium border-b border-gray-50'>
                        Vào trang Quản trị
                      </p>
                    )}

                    {role === 'user' && (
                      <p onClick={() => navigate('/profile')} className='px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer text-sm font-medium border-b border-gray-50'>
                        Hồ sơ cá nhân
                      </p>
                    )}

                    {/* Nút đăng xuất chung */}
                    <p 
                      onClick={logout} 
                      className='px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer text-sm font-bold transition-colors flex items-center gap-2'
                    >
                      Đăng xuất
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PHẦN LOGIC KHI CHƯA ĐĂNG NHẬP */
            <div className='flex items-center gap-2'>
              <p 
                onClick={() => navigate('/recruiter-login')} 
                className='hidden md:block text-gray-600 cursor-pointer hover:text-blue-600 text-sm font-medium mr-2'
              >
                Nhà tuyển dụng?
              </p>
              <button 
                onClick={() => setShowLogin(true)} 
                className='bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 transition-all font-bold shadow-md active:scale-95'
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