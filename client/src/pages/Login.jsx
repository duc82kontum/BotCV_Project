import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const { backendUrl, setToken } = useContext(AppContext);
    
    // State để lấy dữ liệu từ các ô Input
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Gọi API bằng Axios
            const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                name, email, password, phone
            });

            if (data.success) {
                setToken(data.token); // Lưu token vào Context
                toast.success("Đăng ký thành công!");
                // Chuyển hướng hoặc đóng Modal ở đây
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            {/* Tạo các ô input và gán giá trị onChange cho name, email, password, phone */}
            <button type="submit">Đăng ký tài khoản</button>
        </form>
    );
};

export default Login