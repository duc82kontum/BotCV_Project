import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
    User, Phone, MapPin, GraduationCap, Briefcase, 
    Award, FileText, Mail, Edit3, ExternalLink 
} from 'lucide-react';
import BackButton from '../components/BackButton'; 

const ViewProfile = () => {
    const { userData, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    if (!userData) {
        return <div className="py-20 text-center font-medium text-gray-500">Đang tải dữ liệu hồ sơ...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 py-10 min-h-[80vh]">
            <BackButton className="mb-4" />
            {/* Header hồ sơ */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        
                        {/* HIỂN THỊ ẢNH ĐẠI DIỆN HOẶC CHỮ CÁI ĐẦU */}
                        {userData.image ? (
                            <img 
                                src={`${backendUrl}${userData.image}`} 
                                alt="Avatar"
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-blue-100 border-2 border-white" 
                            />
                        ) : (
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-100">
                                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">{userData.name}</h1>
                            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{userData.field || 'Chưa cập nhật lĩnh vực'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/edit-profile')}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        <Edit3 size={18} />
                        Sửa hồ sơ
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột trái: Liên hệ */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Thông tin liên hệ</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-600 truncate">{userData.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-600">{userData.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-600">{userData.address || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>

                    {/* CV File */}
                    <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-100 text-white">
                        <FileText className="mb-4 opacity-80" size={30} />
                        <h3 className="font-bold mb-1">Hồ sơ đính kèm</h3>
                        <p className="text-blue-100 text-xs mb-4">CV của bạn đã được tải lên hệ thống.</p>
                        {userData.cvUrl ? (
                            <a 
                                href={`${backendUrl}${userData.cvUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                            >
                                <ExternalLink size={14} />
                                Xem CV của bạn
                            </a>
                        ) : (
                            <button onClick={() => navigate('/edit-profile')} className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-xs border border-blue-400 opacity-80">
                                Chưa có CV
                            </button>
                        )}
                    </div>
                </div>

                {/* Cột phải: Học vấn & Kinh nghiệm */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Chi tiết năng lực</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Bằng cấp</p>
                                    <p className="font-bold text-gray-700">{userData.degree || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Lĩnh vực</p>
                                    <p className="font-bold text-gray-700">{userData.field || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Trình độ/Kinh nghiệm</p>
                                    <p className="font-bold text-gray-700">{userData.level || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-center text-sm text-gray-500 font-medium italic">
                            "Hồ sơ đầy đủ sẽ giúp bạn tăng 80% cơ hội nhận được lời mời phỏng vấn từ các nhà tuyển dụng hàng đầu."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;