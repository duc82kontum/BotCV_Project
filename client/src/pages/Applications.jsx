import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl, token } = useContext(AppContext);

  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/apply/user-applications`, {
        headers: { token }
      });

      if (data.success) {
        // Kiểm tra dữ liệu trong Console (F12)
        console.log("Dữ liệu từ Server:", data.applications); 
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserApplications();
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="container mx-auto p-4 py-10 min-h-[65vh]">
      <h2 className="text-2xl font-semibold mb-6">Việc làm đã ứng tuyển</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-700">Công ty</th>
              <th className="p-4 font-semibold text-gray-700">Vị trí</th>
              <th className="p-4 font-semibold text-gray-700">Địa điểm</th>
              <th className="p-4 font-semibold text-gray-700">Ngày ứng tuyển</th>
              <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={app.companyId?.image 
                        ? `${backendUrl}/uploads/${app.companyId.image}` 
                        : '/default_company.jpg'
                      } 
                      alt="logo" 
                      className="w-12 h-12 rounded border object-contain bg-white p-1"
                      onError={(e) => { e.target.src = '/default_company.png'; }}
                    />
                    <span className="font-medium text-gray-800">{app.companyId?.companyName}</span>
                  </td>
                  <td className="p-4 text-blue-600 font-medium">{app.jobId?.title}</td>
                  <td className="p-4 text-gray-600">{app.jobId?.provinceCode}</td>
                  <td className="p-4 text-gray-600">{dayjs(app.createdAt).format('DD/MM/YYYY')}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Từ chối' ? 'bg-red-100 text-red-600' : 
                      app.status === 'Phù hợp' ? 'bg-green-100 text-green-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-10 text-center text-gray-500">Bạn chưa ứng tuyển công việc nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;