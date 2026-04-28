import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { AppContext } from '../context/AppContext';
import BackButton from '../components/BackButton'; 

const Applications = () => {
  const navigate = useNavigate(); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { backendUrl, token, fetchApplyCount } = useContext(AppContext);

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

  const handleCancelApply = async (appId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy ứng tuyển công việc này không?")) {
      try {
        const { data } = await axios.delete(`${backendUrl}/api/apply/delete/${appId}`, {
          headers: { token }
        });

        if (data.success) {
          toast.success(data.message);
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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 py-10 min-h-[65vh]">
      <BackButton className="mb-4" />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
        Việc làm đã ứng tuyển
      </h2>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Công ty</th>
              <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Vị trí</th>
              <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-center">Trạng thái</th>
              <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/apply-job/${app.jobId?._id}`)}
                >
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={app.companyId?.image 
                        ? `${backendUrl}/uploads/${app.companyId.image}` 
                        : '/default_company.png'
                      } 
                      className="w-12 h-12 rounded-xl border border-gray-100 object-contain bg-white p-1 shadow-sm"
                      onError={(e) => { e.target.src = '/default_company.png'; }}
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 leading-none mb-1">{app.companyId?.companyName}</span>
                      <span className="text-[10px] text-gray-400 font-medium italic">
                        Nộp ngày: {dayjs(app.createdAt).format('DD/MM/YYYY')}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700 font-bold group-hover:text-blue-600 transition-colors">{app.jobId?.title}</p>
                    <p className="text-xs text-gray-400">{app.jobId?.district}, {app.jobId?.provinceCode}</p>
                  </td>
                  <td className="p-4 text-center">
                    {/* CẬP NHẬT: Sử dụng trực tiếp statusWaiting từ database */}
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-tight shadow-sm border ${
                      app.isDenied // Giả sử bạn có logic check denied/success riêng
                        ? 'bg-red-50 text-red-600 border-red-100' : 
                      app.isSuccess
                        ? 'bg-green-50 text-green-600 border-green-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100' // Luôn hiện màu cam cho statusWaiting
                    }`}>
                      {app.statusWaiting || "Đang chờ duyệt"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleCancelApply(app._id);
                      }}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-9 h-9 rounded-xl transition-all flex items-center justify-center mx-auto"
                      title="Hủy ứng tuyển"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-400">
                  Bạn chưa ứng tuyển công việc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;