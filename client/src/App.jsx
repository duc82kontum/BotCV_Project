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
import SavedJobs from './pages/SavedJobs'; 
import Profile from './pages/Profile'
import ViewProfile from './pages/ViewProfile' // IMPORT TRANG XEM HỒ SƠ

// IMPORT CÁC TRANG CỦA NHÀ TUYỂN DỤNG (RECRUITER)
import Dashboard from './pages/Recuiter/Dashboard';
import DashboardHome from './pages/Recuiter/DashboardHome';
import ViewApplication from './pages/Recuiter/ViewApplication';
import AddJob from './pages/Recuiter/AddJob'; 
import ManageJobs from './pages/Recuiter/ManageJobs';
import CompanyProfile from './pages/Recuiter/CompanyProfile';

// IMPORT CÁC TRANG ADMIN
import AdminHome from './pages/Admin/AdminHome';
import AdminDashBoard from './pages/Admin/AdminDashBoard';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation();

  // Kiểm tra để ẩn Navbar mặc định ở các trang quản trị (Admin & Recruiter)
  const isHiddenNavbar = location.pathname.startsWith('/dashboard-admin') || location.pathname.startsWith('/dashboard');

  return (
    <div className='min-h-screen bg-white relative'>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {showLogin && <JobLogin setShowLogin={setShowLogin} />}
      
      {/* Chỉ hiển thị Navbar nếu không phải trang Dashboard */}
      {!isHiddenNavbar && <Navbar setShowLogin={setShowLogin} />}
      
      <div className={!isHiddenNavbar ? 'container px-4 2xl:px-20 mx-auto' : ''}>
        <div className='flex flex-col min-h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/apply-job/:id' element={<ApplyJob />} />
            
            {/* Tuyến đường bảo vệ cho Người tìm việc */}
            <Route path='/applications' element={
              <ProtectedRoute allowedRoles={['user']}>
                <Applications />
              </ProtectedRoute>
            } />

            <Route path='/saved-jobs' element={
              <ProtectedRoute allowedRoles={['user']}>
                <SavedJobs />
              </ProtectedRoute>
            } />

            {/* --- ROUTE CHO TRANG XEM HỒ SƠ --- */}
            <Route path='/profile' element={
              <ProtectedRoute allowedRoles={['user']}>
                <ViewProfile />
              </ProtectedRoute>
            } />

            {/* --- ROUTE CHO TRANG SỬA HỒ SƠ --- */}
            <Route path='/edit-profile' element={
              <ProtectedRoute allowedRoles={['user']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Tuyến đường dành cho Nhà tuyển dụng đăng nhập */}
            <Route path='/recruiter-login' element={<RecruiterLogin />} />

            {/* --- TRANG QUẢN TRỊ NHÀ TUYỂN DỤNG (RECRUITER DASHBOARD) --- */}
            <Route 
              path='/dashboard' 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            >
              {/* Nested Routes: Các trang con sẽ được render vào thẻ <Outlet /> của Dashboard */}
              <Route index element={<DashboardHome />} />
              <Route path='view-applications' element={<ViewApplication />} />
              <Route path='add-job' element={<AddJob />} /> 
              <Route path='manage-jobs' element={<ManageJobs />} />
              <Route path='company-profile' element={<CompanyProfile />} />
            </Route>

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