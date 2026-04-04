import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  // Lấy dữ liệu từ AppContext
  const { token, setToken, userData, setUserData } = useContext(AppContext)

  // Hàm đăng xuất
  const logout = () => {
    setToken('') // Xóa token trong AppContext
    setUserData(null) // Xóa dữ liệu user
    localStorage.removeItem('token') // Xóa token trong bộ nhớ trình duyệt
    navigate('/')
  }

  return (
    <div className='shadow py-4 bg-white'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        
        {/* Logo */}
        <h1 
          onClick={() => navigate('/')} 
          className='text-2xl font-bold text-blue-600 cursor-pointer tracking-tighter'
        >
          Bot<span className='text-gray-800'>CV</span>
        </h1>

        <div className='flex items-center gap-4'>
          {/* Kiểm tra: Nếu có token và đã có dữ liệu User thì hiện Tên, ngược lại hiện nút Sign In */}
          {token && userData ? (
            <div className='flex items-center gap-3 group relative'>
              {/* Hiển thị tên người dùng */}
              <p className='hidden md:block text-gray-700 font-medium'>
                Chào, {userData.name}
              </p>
              
              {/* Avatar vòng tròn chứa chữ cái đầu của tên */}
              <div className='w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold shadow-sm cursor-pointer'>
                {userData.name.charAt(0).toUpperCase()}
              </div>

              {/* Menu thả xuống khi di chuột (hover) vào Avatar */}
              <div className='absolute top-full right-0 pt-2 hidden group-hover:block z-50'>
                <div className='bg-white border border-gray-100 rounded-lg shadow-xl py-2 w-40'>
                  <p 
                    onClick={logout} 
                    className='px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer text-sm font-medium transition-colors'
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowLogin(true)} 
              className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700 transition-all font-medium shadow-md active:scale-95'
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar