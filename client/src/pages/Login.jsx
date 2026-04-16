import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { backendUrl, setToken, setRole, setUserData } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
            const payload = isLogin ? { email, password } : { name, email, password, phone };

            const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

            if (data.success) {
                // 1. LƯU DỮ LIỆU ĐỘNG TỪ BACKEND TRẢ VỀ (Token và Role thật)
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role); 

                // 2. CẬP NHẬT TRẠNG THÁI TRONG CONTEXT
                setToken(data.token);
                setRole(data.role); 
                setUserData(data.user);
                
                toast.success(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
                
                // 3. ĐIỀU HƯỚNG THÔNG MINH DỰA TRÊN QUYỀN HẠN (ROLE)
                if (isLogin) {
                    setTimeout(() => {
                        if (data.role === 'admin') {
                            // Nếu là Admin, chuyển thẳng vào Dashboard Admin
                            navigate('/dashboard-admin');
                        } else if (data.role === 'recruiter') {
                            // Nếu là Nhà tuyển dụng, chuyển vào Dashboard Recruiter
                            navigate('/dashboard');
                        } else {
                            // Nếu là User thường, quay về trang chủ
                            navigate('/');
                        }
                    }, 300);
                } else {
                    // Nếu vừa đăng ký xong, chuyển sang trạng thái Đăng nhập để người dùng login
                    setIsLogin(true);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Lỗi submit:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-600 text-sm shadow-lg bg-white">
                <p className="text-2xl font-semibold text-center text-blue-600">
                    {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                </p>
                <p className="text-center text-gray-400">Vui lòng {isLogin ? 'đăng nhập' : 'đăng ký'} để ứng tuyển công việc</p>
                
                {!isLogin && (
                    <>
                        <p className="font-medium">Họ tên</p>
                        <input className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-blue-500 outline-none" type="text" onChange={(e) => setName(e.target.value)} value={name} required />
                        <p className="font-medium">Số điện thoại</p>
                        <input className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-blue-500 outline-none" type="text" onChange={(e) => setPhone(e.target.value)} value={phone} required />
                    </>
                )}
                
                <p className="font-medium">Email</p>
                <input className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-blue-500 outline-none" type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                
                <p className="font-medium">Mật khẩu</p>
                <input className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-blue-500 outline-none" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                
                <button type="submit" className="bg-blue-600 text-white w-full py-2.5 rounded-md text-base mt-4 font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md">
                    {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </button>

                <div className="mt-4 text-center">
                    {isLogin ? (
                        <p>Chưa có tài khoản? <span onClick={() => setIsLogin(false)} className="text-blue-600 font-bold underline cursor-pointer">Đăng ký ngay</span></p>
                    ) : (
                        <p>Đã có tài khoản? <span onClick={() => setIsLogin(true)} className="text-blue-600 font-bold underline cursor-pointer">Đăng nhập</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;