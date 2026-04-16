import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob"; 
import Navbar from "./components/Navbar";
import JobLogin from './components/JobLogin'
import ProtectedRoute from './components/ProtectedRoute'; 
import RecruiterLogin from './pages/RecruiterLogin'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// IMPORT CÁC TRANG ADMIN
import AdminHome from './pages/Admin/AdminHome';
import AdminDashBoard from './pages/Admin/AdminDashBoard';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation();

  // Kiểm tra xem có đang ở trang Admin hay không để ẩn Navbar hoặc điều chỉnh Padding
  const isAdminPage = location.pathname.startsWith('/dashboard-admin');

  return (
    <div className='min-h-screen bg-white relative'>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Form đăng ký/đăng nhập User dạng Modal */}
      {showLogin && <JobLogin setShowLogin={setShowLogin} />}

      <div className='relative z-10'>
        {/* Chỉ hiện Navbar chính khi không phải trang Admin */}
        {!isAdminPage && <Navbar setShowLogin={setShowLogin} />}
        
        {/* Điều chỉnh Padding: Trang chủ cần lề, trang Admin cần tràn viền */}
        <div className={isAdminPage ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path='/' element={<Home />} />
            <Route path='/apply-job/:id' element={<ApplyJob setShowLogin={setShowLogin} />} />
            <Route path='/recruiter-login' element={<RecruiterLogin />} />

            {/* --- RECRUITER ROUTES --- */}
            <Route 
              path='/dashboard' 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <div className="py-10 text-2xl font-bold text-blue-600 text-center">
                    Trang quản lý của Nhà tuyển dụng (Sắp ra mắt)
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* --- ADMIN ROUTES (Sử dụng Layout lồng nhau) --- */}
            <Route 
              path='/dashboard-admin' 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHome />
                </ProtectedRoute>
              } 
            >
              {/* Trang con mặc định hiển thị DashBoard */}
              <Route index element={<AdminDashBoard />} />
              
              {/* Các trang quản lý nội bộ */}
              <Route path='list-account' element={<div className='p-6 text-xl font-semibold'>Quản lý tài khoản hệ thống</div>} />
              <Route path='list-industry' element={<div className='p-6 text-xl font-semibold'>Quản lý danh mục ngành nghề</div>} />
              <Route path='list-apply' element={<div className='p-6 text-xl font-semibold'>Danh sách hồ sơ ứng tuyển</div>} />
            </Route>

            {/* Route 404 */}
            <Route path='*' element={<div className='py-20 text-center text-gray-400'>404 - Trang không tồn tại</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App