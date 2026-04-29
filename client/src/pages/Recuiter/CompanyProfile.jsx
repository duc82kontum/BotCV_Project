import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Building2, Globe, MapPin, Info, Camera, Phone, User, Users, Mail } from 'lucide-react';

const CompanyProfile = () => {
    const { backendUrl, token, userData, setUserData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false); // State lưu file ảnh mới chọn

    // Khởi tạo state khớp chính xác 100% với cấu trúc Database của bạn
    const [formData, setFormData] = useState({
        companyName: '',
        namemanage: '',
        phone: '',
        website: '',
        address: '',
        employees: '',
        description: '',
        email: '' 
    });

    // Đồng bộ dữ liệu từ Context vào Form khi trang load
    useEffect(() => {
        if (userData) {
            setFormData({
                companyName: userData.companyName || '',
                email: userData.email || '',
                namemanage: userData.profile?.namemanage || '',
                phone: userData.profile?.phone || '',
                website: userData.profile?.website || '',
                address: userData.profile?.address || '',
                employees: userData.profile?.employees || '',
                description: userData.profile?.description || ''
            });
        }
    }, [userData]);

    const onUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Sử dụng FormData để gửi được File (Ảnh) và Text (Dữ liệu)
            const dataSend = new FormData();
            dataSend.append('companyName', formData.companyName);
            dataSend.append('namemanage', formData.namemanage);
            dataSend.append('phone', formData.phone);
            dataSend.append('website', formData.website);
            dataSend.append('address', formData.address);
            dataSend.append('employees', formData.employees);
            dataSend.append('description', formData.description);
            
            // Nếu người dùng có chọn ảnh mới thì mới gửi lên
            if (image) {
                dataSend.append('image', image);
            }

            const { data } = await axios.put(backendUrl + '/api/company/update-profile', dataSend, { 
                headers: { token } 
            });

            if (data.success) {
                toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
                setUserData(data.userData); // Cập nhật lại context để hiển thị ảnh mới ngay lập tức
                setImage(false); // Reset state ảnh
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            toast.error(error.response?.data?.message || "Không thể cập nhật hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Thiết lập hồ sơ</h2>
                <p className="text-gray-500 text-sm font-medium">Thông tin này sẽ được hiển thị cho các ứng viên tiềm năng</p>
            </div>

            <form onSubmit={onUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: LOGO & LIÊN HỆ NHANH */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <label htmlFor="logo-upload" className="relative group cursor-pointer transition-transform hover:scale-105">
                            <div className="w-32 h-32 rounded-3xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Preview" />
                                ) : userData?.profile?.logo || userData?.profile?.image ? (
                                    <img 
                                        // ĐÃ CẬP NHẬT: Ghép backendUrl để hiển thị ảnh tải lên từ thư mục uploads
                                        src={(userData.profile.logo || userData.profile.image).startsWith('http') 
                                            ? (userData.profile.logo || userData.profile.image) 
                                            : backendUrl + (userData.profile.logo || userData.profile.image)
                                        } 
                                        className="w-full h-full object-cover" 
                                        alt="Logo" 
                                    />
                                ) : (
                                    <Building2 size={40} className="text-blue-200" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white mb-1" size={24} />
                                    <span className="text-[10px] text-white font-bold uppercase">Thay ảnh</span>
                                </div>
                            </div>
                            <input type="file" id="logo-upload" hidden onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                        </label>
                        <p className="mt-4 font-black text-gray-800 text-center uppercase tracking-tight">{formData.companyName || "Tên Công Ty"}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Thông tin kết nối</h4>
                        
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block uppercase">Email tài khoản</label>
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
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xx xxx xxx" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block uppercase">Website công ty</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="url" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium" 
                                value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: CHI TIẾT DOANH NGHIỆP */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <Info size={20} />
                            </div>
                            <h3 className="font-black text-gray-800 uppercase tracking-tight">Chi tiết hồ sơ</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Tên pháp nhân công ty</label>
                                <input type="text" className="w-full p-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700 text-lg shadow-inner" 
                                value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Người quản lý</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                        value={formData.namemanage} onChange={e => setFormData({...formData, namemanage: e.target.value})} placeholder="Tên anh/chị quản lý..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Quy mô nhân sự</label>
                                    <div className="relative">
                                        <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                        value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} placeholder="VD: 50-100 nhân viên" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Địa chỉ trụ sở</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Số nhà, Tên đường, Quận/Huyện..." />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">Mô tả giới thiệu</label>
                                <textarea rows="8" className="w-full p-5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all resize-none text-gray-600 leading-relaxed font-medium"
                                placeholder="Viết giới thiệu về công ty của bạn để thu hút ứng viên..."
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-gray-300 tracking-widest">
                                {loading ? 'Đang lưu...' : 'Lưu hồ sơ ngay'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default CompanyProfile;