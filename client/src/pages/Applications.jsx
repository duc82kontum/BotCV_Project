import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { AppContext } from '../context/AppContext';
import BackButton from '../components/BackButton'; 
import { Briefcase, Building2, Trash2 } from 'lucide-react';

const Applications = () => {
  const navigate = useNavigate(); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { backendUrl, token, fetchApplyCount } = useContext(AppContext);

  // Hàm lấy danh sách việc làm đã ứng tuyển
  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/apply/user-applications`, {
        headers: { token }
      });

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  // Hàm hủy ứng tuyển
  const handleCancelApply = async (appId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy ứng tuyển công việc này không?")) {
      try {
        const { data } = await axios.delete(`${backendUrl}/api/apply/delete/${appId}`, {
          headers: { token }
        });

        if (data.success) {
          toast.success(data.message || "Đã hủy ứng tuyển thành công");
          await fetchUserApplications();
          fetchApplyCount(); 
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi hủy ứng tuyển");
      }
    }
  };

  useEffect(() => {
    if (token) fetchUserApplications();
  }, [token]);

  // Hàm xử lý màu sắc Badge dựa trên trạng thái (Status)
  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã xem":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Chờ phỏng vấn":
        return "bg-green-50 text-green-600 border-green-100";
      case "Từ chối":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Đang tải hồ sơ của bạn...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 py-10 min-h-[70vh]">
      <BackButton className="mb-6" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase flex items-center gap-3">
            <Briefcase size={32} className="text-blue-600" />
            Việc làm đã ứng tuyển
          </h2>
          <p className="text-gray-500 font-medium mt-1">Theo dõi trạng thái các hồ sơ bạn đã gửi đi</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
           <span className="text-blue-600 font-black text-sm uppercase">Tổng cộng: {applications.length} hồ sơ</span>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Công ty</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vị trí & Địa điểm</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái hồ sơ</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-50 hover:bg-blue-50/10 transition-all cursor-pointer group"
                    onClick={() => navigate(`/apply-job/${app.jobId?._id}`)}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={app.companyId?.image 
                            ? `${backendUrl}${app.companyId.image}` 
                            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                          } 
                          className="w-12 h-12 rounded-2xl border border-gray-100 object-cover bg-white p-1 shadow-sm"
                          alt="Company Logo"
                        />
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 text-sm uppercase leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                            {app.companyId?.companyName || "N/A"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            Nộp ngày: {dayjs(app.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-gray-700 font-black text-sm uppercase mb-1">{app.jobId?.title || "Công việc đã xóa"}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{app.jobId?.district}, {app.jobId?.provinceCode}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm border ${getStatusStyle(app.status)}`}>
                        {app.status || "Đang chờ duyệt"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleCancelApply(app._id);
                        }}
                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto border border-transparent hover:border-red-100"
                        title="Hủy ứng tuyển"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                         <Building2 size={32} />
                      </div>
                      <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Bạn chưa ứng tuyển công việc nào.</p>
                      <button 
                        onClick={() => navigate('/')}
                        className="mt-2 text-blue-600 font-black text-[11px] uppercase border-b-2 border-blue-100 hover:border-blue-600 transition-all pb-1"
                      >
                        Khám phá việc làm ngay
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;