import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext'; 
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { FileText, Mail, Phone, Search } from 'lucide-react';

const ViewApplication = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(""); 

    const statusOptions = [
        "Đang chờ duyệt",
        "Đã xem",
        "Chờ phỏng vấn",
        "Từ chối"
    ];

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/apply/recruiter/applications`, {
                headers: { token } 
            });
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error("Lỗi fetch:", error);
            toast.error("Không thể tải danh sách ứng viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchApplications();
    }, [token]);

    const handleStatusChange = async (appId, newStatus) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/apply/recruiter/update-status/${appId}`, 
                { status: newStatus },
                { headers: { token } } 
            );
            if (data.success) {
                toast.success("Đã cập nhật trạng thái hồ sơ");
                setApplications(prev => prev.map(app => 
                    app._id === appId ? { ...app, status: newStatus } : app
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật");
        }
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Đang tải hồ sơ...</p>
        </div>
    );

    // Xử lý bộ lọc tìm kiếm an toàn
    const filteredApplications = applications.filter(app => {
        if (!filter) return true; 
        const userName = app.userId?.name || ""; 
        return userName.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[80vh]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Quản lý hồ sơ ứng viên</h2>
                    <p className="text-gray-500 text-sm font-medium">Bạn có {applications.length} đơn ứng tuyển</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên ứng viên..." 
                        className="pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 ring-blue-100 w-full md:w-64"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-50">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ứng viên</th>
                            <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vị trí ứng tuyển</th>
                            <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tài liệu</th>
                            <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái xử lý</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app, index) => (
                                <tr key={index} className="border-b border-gray-50 hover:bg-blue-50/10 transition-all">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={app.userId?.image ? `${backendUrl}${app.userId.image}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                                                className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-white"
                                                alt="Avatar"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800 leading-none mb-1.5 uppercase text-sm">
                                                    {app.userId?.name || "Ứng viên"}
                                                </p>
                                                <div className="flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5"><Mail size={12}/> {app.userId?.email || "Chưa cập nhật"}</span>
                                                    <span className="flex items-center gap-1.5"><Phone size={12}/> {app.userId?.phone || "Chưa cập nhật"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="font-bold text-gray-700 text-sm mb-1">{app.jobId?.title || 'Công việc đã xóa'}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Ngày nộp: {dayjs(app.createdAt).format('DD/MM/YYYY')}</p>
                                    </td>
                                    <td className="p-5 text-center">
                                        <a 
                                            href={`${backendUrl}${app.userCvUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            onClick={() => {
                                                if (app.status === "Đang chờ duyệt") handleStatusChange(app._id, "Đã xem");
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <FileText size={14} /> Xem CV
                                        </a>
                                    </td>
                                    <td className="p-5">
                                        <select 
                                            value={app.status || "Đang chờ duyệt"}
                                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl text-[11px] font-black uppercase outline-none cursor-pointer transition-all border shadow-sm ${
                                                app.status === 'Từ chối' ? 'bg-red-50 text-red-600 border-red-100' :
                                                app.status === 'Chờ phỏng vấn' ? 'bg-green-50 text-green-600 border-green-100' :
                                                app.status === 'Đã xem' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}
                                        >
                                            {statusOptions.map((opt, i) => (
                                                <option key={i} value={opt} className="bg-white text-gray-800">{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-20 text-center text-gray-400 font-medium italic">
                                    Không tìm thấy hồ sơ ứng viên nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewApplication;