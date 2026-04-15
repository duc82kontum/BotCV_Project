import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const JobLogin = ({ setShowLogin }) => {
    const [state, setState] = useState('Đăng nhập')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')

    const { backendUrl, setToken, setRole, setUserData } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (state === "Đăng ký") {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password, phone })
                
                if (data.success) {
                    // Cập nhật động từ dữ liệu Backend trả về
                    setToken(data.token)
                    setRole(data.role) // Thay 'user' thành data.role
                    setUserData(data.user)

                    localStorage.setItem('token', data.token)
                    localStorage.setItem('role', data.role) // Thay 'user' thành data.role

                    setShowLogin(false)
                    toast.success("Đăng ký thành công!")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
                
                if (data.success) {
                    // QUAN TRỌNG: Lấy role trực tiếp từ Backend (User/Admin)
                    setToken(data.token)
                    setRole(data.role) // Thay 'user' thành data.role
                    setUserData(data.user)

                    localStorage.setItem('token', data.token)
                    localStorage.setItem('role', data.role) // Thay 'user' thành data.role

                    setShowLogin(false)
                    toast.success("Chào mừng bạn quay lại!")
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border">
                <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">{state}</h1>
                <p className="text-gray-500 text-center mb-6 text-sm">Vui lòng điền thông tin để tiếp tục</p>
                
                <div className="flex flex-col gap-4">
                    {state === 'Đăng ký' && (
                        <input 
                            onChange={e => setName(e.target.value)} value={name}
                            className="border border-gray-300 p-2 px-4 rounded-full outline-none focus:border-blue-500" 
                            type="text" placeholder="Họ và tên" required 
                        />
                    )}
                    
                    <input 
                        onChange={e => setEmail(e.target.value)} value={email}
                        className="border border-gray-300 p-2 px-4 rounded-full outline-none focus:border-blue-500" 
                        type="email" placeholder="Email" required 
                    />
                    
                    <input 
                        onChange={e => setPassword(e.target.value)} value={password}
                        className="border border-gray-300 p-2 px-4 rounded-full outline-none focus:border-blue-500" 
                        type="password" placeholder="Mật khẩu" required 
                    />

                    {state === 'Đăng ký' && (
                        <input 
                            onChange={e => setPhone(e.target.value)} value={phone}
                            className="border border-gray-300 p-2 px-4 rounded-full outline-none focus:border-blue-500" 
                            type="text" placeholder="Số điện thoại" required 
                        />
                    )}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-full mt-6 hover:bg-blue-700 font-medium transition-all active:scale-95 shadow-md">
                    {state === 'Đăng nhập' ? 'Đăng nhập' : 'Tạo tài khoản'}
                </button>

                <p className="mt-5 text-center text-sm text-gray-600">
                    {state === 'Đăng nhập' 
                        ? <>Chưa có tài khoản? <span className="text-blue-600 cursor-pointer font-bold hover:underline" onClick={() => setState('Đăng ký')}>Đăng ký</span></>
                        : <>Đã có tài khoản? <span className="text-blue-600 cursor-pointer font-bold hover:underline" onClick={() => setState('Đăng nhập')}>Đăng nhập</span></>
                    }
                </p>

                <button 
                    type="button" 
                    onClick={() => setShowLogin(false)} 
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl transition-colors"
                >
                    ✕
                </button>
            </form>
        </div>
    )
}

export default JobLogin