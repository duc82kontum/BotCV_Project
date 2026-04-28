import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  
  // Lấy applyCount và savedCount trực tiếp từ Context để đảm bảo tính Real-time
  const { token, userData, role, logout, applyCount, savedCount } = useContext(AppContext)

  // Hàm lấy chữ cái đầu tiên của tên người dùng và chuyển thành chữ hoa
  const getUserInitial = () => {
    if (userData && userData.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return 'U'; // Mặc định nếu không lấy được tên
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
          {/* Menu điều hướng cho User */}
          {token && userData && (
            <div className='hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-gray-600'>
              {role === 'user' && (
                <>
                  {/* Mục Việc đã ứng tuyển */}
                  <div 
                    onClick={() => navigate('/applications')} 
                    className='relative cursor-pointer hover:text-blue-600 flex items-center gap-1 transition-colors'
                  >
                    <span>Việc đang ứng tuyển</span>
                    
                    {/* Badge số lượng đơn ứng tuyển */}
                    {applyCount > 0 && (
                      <span className='absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce'>
                        {applyCount}
                      </span>
                    )}
                  </div>

                  {/* Mục Việc đã lưu với Badge số lượng */}
                  <div 
                    onClick={() => navigate('/saved-jobs')} 
                    className='relative cursor-pointer hover:text-blue-600 flex items-center gap-1 transition-colors'
                  >
                    <span>Việc đã lưu</span>
                    
                    {/* Badge số lượng việc làm đã lưu: Sẽ tự động cập nhật từ Context */}
                    {savedCount > 0 && (
                      <span className='absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce'>
                        {savedCount}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {token && userData ? (
            <div className='flex items-center gap-3'>
              <div className='group relative'>
                <div className='flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-all'>
                  
                  {/* PHẦN HIỂN THỊ CHỮ CÁI ĐẦU THAY CHO ẢNH */}
                  <div className='w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-100 shadow-sm'>
                    {getUserInitial()}
                  </div>

                  <div className='hidden sm:block'>
                    <p className='text-sm font-bold text-gray-800 leading-tight'>{userData.name}</p>
                    <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider'>{role}</p>
                  </div>
                </div>
                
                {/* Dropdown Menu */}
                <div className='absolute right-0 top-full pt-2 hidden group-hover:block w-48 animate-fadeIn'>
                  <div className='bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden'>
                    {role === 'user' && (
                      <p onClick={() => navigate('/profile')} className='px-4 py-2.5 hover:bg-blue-50 text-gray-700 cursor-pointer text-sm transition-colors border-b border-gray-50'>
                        Hồ sơ cá nhân
                      </p>
                    )}
                    <p 
                      onClick={logout} 
                      className='px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer text-sm font-bold transition-colors'
                    >
                      Đăng xuất
                    </p>
                  </div>
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
                className='bg-blue-600 text-white px-7 py-2 rounded-full hover:bg-blue-700 transition-all font-medium shadow-md active:scale-95'
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