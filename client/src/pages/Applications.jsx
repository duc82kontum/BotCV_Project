import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy fetchApplyCount từ Context để cập nhật con số trên Navbar
  const { backendUrl, token, fetchApplyCount } = useContext(AppContext);

  // Hàm lấy danh sách đã ứng tuyển
  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/apply/user-applications`, {
        headers: { token }
      });

      if (data.success) {
        console.log("Dữ liệu từ Server:", data.applications); 
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý hủy ứng tuyển
  const handleCancelApply = async (appId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy ứng tuyển công việc này không?")) {
      try {
        const { data } = await axios.delete(`${backendUrl}/api/apply/delete/${appId}`, {
          headers: { token }
        });

        if (data.success) {
          toast.success(data.message);
          
          // 1. Tải lại danh sách tại trang hiện tại
          await fetchUserApplications();
          
          // 2. Cập nhật lại con số trên Navbar ngay lập tức
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="container mx-auto p-4 py-10 min-h-[65vh]">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Việc làm đã ứng tuyển</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Công ty</th>
              <th className="p-4 font-semibold text-gray-700">Vị trí</th>
              <th className="p-4 font-semibold text-gray-700">Địa điểm</th>
              <th className="p-4 font-semibold text-gray-700">Ngày nộp</th>
              <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={app.companyId?.image 
                        ? `${backendUrl}/uploads/${app.companyId.image}` 
                        : '/default_company.png'
                      } 
                      alt="logo" 
                      className="w-12 h-12 rounded border object-contain bg-white p-1 shadow-sm"
                      onError={(e) => { e.target.src = '/default_company.png'; }}
                    />
                    <span className="font-medium text-gray-800">{app.companyId?.companyName}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                      {app.jobId?.title}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{app.jobId?.provinceCode}</td>
                  <td className="p-4 text-gray-600">
                    {dayjs(app.createdAt).format('DD/MM/YYYY')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                      app.status === 'Từ chối' ? 'bg-red-100 text-red-600' : 
                      app.status === 'Phù hợp' ? 'bg-green-100 text-green-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleCancelApply(app._id)}
                      className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1 rounded transition-all text-sm font-medium"
                    >
                      Hủy đơn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📁</span>
                    <p>Bạn chưa ứng tuyển công việc nào.</p>
                  </div>
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