import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob"; 
import Navbar from "./components/Navbar";
import JobLogin from './components/JobLogin'
import ProtectedRoute from './components/ProtectedRoute'; // Import bộ gác cổng
import RecruiterLogin from './pages/RecruiterLogin'; // 1. THÊM DÒNG NÀY ĐỂ HẾT LỖI
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className='min-h-screen bg-white relative'>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Form đăng ký/đăng nhập User (người tìm việc) dạng Modal */}
      {showLogin && <JobLogin setShowLogin={setShowLogin} />}

      <div className='relative z-10'>
        <Navbar setShowLogin={setShowLogin} />
        
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path='/' element={<Home />} />
            <Route path='/apply-job/:id' element={<ApplyJob setShowLogin={setShowLogin} />} />
            
            {/* 2. THÊM ROUTE CHO TRANG ĐĂNG NHẬP DOANH NGHIỆP */}
            <Route path='/recruiter-login' element={<RecruiterLogin />} />

            {/* RECRUITER ROUTES */}
            <Route 
              path='/dashboard' 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  {/* Thay bằng component Dashboard thật của bạn khi làm xong giao diện */}
                  <div className="py-10 text-2xl">Trang quản lý của Nhà tuyển dụng</div>
                </ProtectedRoute>
              } 
            />

            {/* ADMIN ROUTES */}
            <Route 
              path='/admin-panel' 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  {/* Thay bằng component Admin thật của bạn */}
                  <div className="py-10 text-2xl text-red-600">Trang quản trị hệ thống</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App