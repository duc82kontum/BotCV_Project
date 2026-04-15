import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob"; // Import trang chi tiết
import Navbar from "./components/Navbar";
import JobLogin from './components/JobLogin'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className='min-h-screen bg-white relative'>
      {/* Container thông báo popup */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Hiển thị Modal đăng nhập/đăng ký đè lên trang web */}
      {showLogin && <JobLogin setShowLogin={setShowLogin} />}

      <div className='relative z-10'>
        <Navbar setShowLogin={setShowLogin} />
        
        {/* Nội dung chính của trang web */}
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Routes>
            <Route path='/' element={<Home />} />
            {/* Thêm Route cho trang chi tiết công việc */}
            <Route path='/apply-job/:id' element={<ApplyJob setShowLogin={setShowLogin} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App