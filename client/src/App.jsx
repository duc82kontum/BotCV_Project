import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob"; 
import Applications from "./pages/Applications"; 
import Navbar from "./components/Navbar";
import JobLogin from './components/JobLogin'
import ProtectedRoute from './components/ProtectedRoute'; 
import RecruiterLogin from './pages/RecruiterLogin'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SavedJobs from './pages/SavedJobs'; //

// IMPORT CÁC TRANG ADMIN
import AdminHome from './pages/Admin/AdminHome';
import AdminDashBoard from './pages/Admin/AdminDashBoard';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation();

  // Kiểm tra trang Admin để ẩn Navbar
  const isAdminPage = location.pathname.startsWith('/dashboard-admin');

  return (
    <div className='min-h-screen bg-white relative'>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Modal đăng nhập */}
      {showLogin && <JobLogin setShowLogin={setShowLogin} />}

      <div className='relative z-10'>
        {/* Navbar chỉ hiện ở trang người dùng */}
        {!isAdminPage && <Navbar setShowLogin={setShowLogin} />}
        
        <div className={isAdminPage ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
          <Routes>
            {/* --- CÁC TRANG CÔNG KHAI --- */}
            <Route path='/' element={<Home />} />
            <Route path='/apply-job/:id' element={<ApplyJob setShowLogin={setShowLogin} />} />
            <Route path='/recruiter-login' element={<RecruiterLogin />} />

            {/* --- TRANG CỦA NGƯỜI DÙNG (Cần đăng nhập) --- */}
            <Route 
              path='/applications' 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Applications />
                </ProtectedRoute>
              } 
            />

            {/* ROUTE MỚI: Việc làm đã lưu */}
            <Route 
              path='/saved-jobs' 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <SavedJobs />
                </ProtectedRoute>
              } 
            />

            {/* --- TRANG NHÀ TUYỂN DỤNG --- */}
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

            {/* --- TRANG QUẢN TRỊ (ADMIN) --- */}
            <Route 
              path='/dashboard-admin' 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHome />
                </ProtectedRoute>
              } 
            >
              <Route index element={<AdminDashBoard />} />
              <Route path='list-account' element={<div className='p-6 text-xl font-semibold'>Quản lý tài khoản hệ thống</div>} />
              <Route path='list-industry' element={<div className='p-6 text-xl font-semibold'>Quản lý danh mục ngành nghề</div>} />
              <Route path='list-apply' element={<div className='p-6 text-xl font-semibold'>Danh sách hồ sơ ứng tuyển</div>} />
            </Route>

            {/* Xử lý trang không tồn tại */}
            <Route path='*' element={<div className='py-20 text-center text-gray-400'>404 - Trang không tồn tại</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App