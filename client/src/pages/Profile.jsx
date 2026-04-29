import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, GraduationCap, Briefcase, Award, FileText, UploadCloud, Mail } from 'lucide-react';
import BackButton from '../components/BackButton'; 

const Profile = () => {
    const { backendUrl, token, userData, setUserData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    
    // State quản lý file upload
    const [cvFile, setCvFile] = useState(null); 
    const [imageFile, setImageFile] = useState(null); // State mới cho Avatar

    // Khởi tạo state khớp với Schema
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', degree: '', field: '', level: '', address: ''
    });

    // Đồng bộ dữ liệu khi trang load
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
                degree: userData.degree || '',
                field: userData.field || '',
                level: userData.level || '',
                address: userData.address || ''
            });
        }
    }, [userData]);

    const onUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataSend = new FormData();
            dataSend.append('name', formData.name);
            dataSend.append('phone', formData.phone);
            dataSend.append('degree', formData.degree);
            dataSend.append('field', formData.field);
            dataSend.append('level', formData.level);
            dataSend.append('address', formData.address);
            
            // Gửi file CV lên nếu có chọn mới
            if (cvFile) {
                dataSend.append('cvFile', cvFile);
            }
            
            // Gửi file Ảnh đại diện lên nếu có chọn mới
            if (imageFile) {
                dataSend.append('image', imageFile);
            }

            // Gọi API Update-Profile (đã hỗ trợ upload.fields)
            const { data } = await axios.put(backendUrl + '/api/user/update-profile', dataSend, { 
                headers: { token } 
            });

            if (data.success) {
                toast.success("Cập nhật hồ sơ thành công!");
                setUserData(data.user); // Đồng bộ lại Context (Bao gồm link ảnh mới)
                setCvFile(null); // Reset input file CV
                setImageFile(null); // Reset input file Ảnh
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            toast.error(error.response?.data?.message || "Không thể cập nhật hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 py-10 min-h-[70vh]">
            <BackButton className="mb-4" />
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Hồ sơ cá nhân</h2>
                <p className="text-gray-500 text-sm font-medium">Hoàn thiện hồ sơ để thu hút nhà tuyển dụng tốt nhất</p>
            </div>

            <form onSubmit={onUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: THÔNG TIN NHANH, AVATAR & CV */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Khu vực Upload Ảnh Đại Diện */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="relative group mb-4">
                            {/* Hiển thị ảnh: Ưu tiên ảnh vừa chọn > Ảnh từ DB > Ảnh mặc định */}
                            <img 
                                src={imageFile ? URL.createObjectURL(imageFile) : (userData?.image ? `${backendUrl}${userData.image}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png')} 
                                alt="Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md"
                            />
                            <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                                <UploadCloud className="text-white" size={28} />
                                <input type="file" id="image-upload" hidden onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                            </label>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">Ảnh đại diện</h3>
                        <p className="text-xs text-gray-500">Định dạng JPG, PNG</p>
                    </div>

                    {/* Khu vực Upload CV */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={28} />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">CV / Sơ yếu lý lịch</h3>
                        <p className="text-xs text-gray-500 mb-4">Hỗ trợ định dạng PDF, JPG, PNG</p>
                        
                        <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all group">
                            <UploadCloud className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                            <span className="text-sm font-bold text-blue-600 truncate px-4 max-w-full">
                                {cvFile ? cvFile.name : 'Tải lên CV mới'}
                            </span>
                            <input type="file" id="cv-upload" hidden onChange={(e) => setCvFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
                        </label>

                        {/* Xem CV hiện tại */}
                        {userData?.cvUrl && !cvFile && (
                            <a 
                                href={`${backendUrl}${userData.cvUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-center gap-1 text-sm text-green-600 font-bold hover:underline"
                            >
                                Xem CV hiện tại của bạn
                            </a>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Thông tin tài khoản</h4>
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block uppercase">Email đăng nhập</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-400 text-sm cursor-not-allowed font-medium" value={formData.email} disabled />
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block uppercase">Số điện thoại</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" 
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xx xxx xxx" required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: CHI TIẾT HỒ SƠ */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-800 uppercase tracking-tight border-b border-gray-50 pb-4 mb-6">Chi tiết học vấn & kinh nghiệm</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Họ và Tên</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700 shadow-inner" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Bằng cấp cao nhất</label>
                                    <div className="relative">
                                        <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600 appearance-none"
                                            value={formData.degree} 
                                            onChange={e => setFormData({...formData, degree: e.target.value})}
                                        >
                                            <option value="">Chọn bằng cấp...</option>
                                            <option value="Trung học">Trung học</option>
                                            <option value="Phổ thông">Phổ thông</option>
                                            <option value="Cử nhân">Cử nhân</option>
                                            <option value="Kỹ sư">Kỹ sư</option>
                                            <option value="Thạc sĩ">Thạc sĩ</option>
                                            <option value="Tiến sĩ">Tiến sĩ</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Lĩnh vực / Ngành nghề</label>
                                    <div className="relative">
                                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                        value={formData.field} onChange={e => setFormData({...formData, field: e.target.value})} placeholder="VD: Lập trình viên..." />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Kinh nghiệm</label>
                                    <div className="relative">
                                        <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                        value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} placeholder="VD: Junior, 2 năm..." />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Địa chỉ hiện tại</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Số nhà, đường, tỉnh..." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-gray-300 tracking-widest flex items-center gap-2">
                                {loading ? 'Đang lưu...' : 'Lưu hồ sơ ngay'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Profile;