import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { Trash2, Eye, EyeOff } from 'lucide-react';

const ManageJobs = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Gọi API lấy danh sách tin đã đăng
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
                headers: { Authorization: `Bearer ${token}`, token: token }
            });
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách việc làm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchJobs();
    }, [token]);

    // 2. Xử lý Ẩn/Hiện tin
    const toggleVisibility = async (id, currentStatus) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/company/change-job`, 
                { id, visible: !currentStatus }, 
                { headers: { Authorization: `Bearer ${token}`, token: token } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchJobs(); // Tải lại danh sách
            }
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    // 3. Xử lý Xóa tin
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.")) return;
        
        try {
            const { data } = await axios.delete(`${backendUrl}/api/company/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}`, token: token }
            });
            if (data.success) {
                toast.success(data.message);
                fetchJobs();
            }
        } catch (error) {
            toast.error("Lỗi khi xóa tin");
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-black text-blue-600 mb-6 border-b pb-4">Quản lý tin tuyển dụng</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-bold">Tiêu đề công việc</th>
                            <th className="p-4 font-bold text-center">Ngày đăng</th>
                            <th className="p-4 font-bold text-center">Ứng viên cần tuyển</th>
                            <th className="p-4 font-bold text-center">Trạng thái (Ẩn/Hiện)</th>
                            <th className="p-4 font-bold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-blue-500 font-medium animate-pulse">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-gray-400">
                                    Bạn chưa đăng tin tuyển dụng nào.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800">{job.title}</p>
                                        <p className="text-xs text-gray-500">{job.level} • {job.type}</p>
                                    </td>
                                    <td className="p-4 text-center text-gray-600 text-sm">
                                        {dayjs(job.createdAt).format("DD/MM/YYYY")}
                                    </td>
                                    <td className="p-4 text-center text-gray-600 font-medium">
                                        {job.slot}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => toggleVisibility(job._id, job.visible)}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${job.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {job.visible ? <><Eye size={14} /> ĐANG HIỆN</> : <><EyeOff size={14} /> ĐÃ ẨN</>}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(job._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa tin"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageJobs;