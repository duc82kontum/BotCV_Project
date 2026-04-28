import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext"; // Đảm bảo đường dẫn này đúng với dự án của bạn
import { Search, User, Briefcase, Calendar, CheckCircle } from "lucide-react";

const ViewApplication = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 1. Hàm gọi API lấy danh sách ứng viên
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        // Gửi token lên backend để authMiddleware xác thực
        headers: { 
            token: token,
            Authorization: `Bearer ${token}` 
        } 
      });
      
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm gọi API thay đổi trạng thái hồ sơ
  const handleChangeStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`, 
        { id, status: newStatus }, 
        { 
            headers: { 
                token: token,
                Authorization: `Bearer ${token}` 
            } 
        }
      );
      
      if (data.success) {
        toast.success("Đã cập nhật trạng thái hồ sơ!");
        fetchData(); // Load lại danh sách sau khi cập nhật
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Lọc ứng viên theo từ khóa tìm kiếm
  const filteredApplications = applications.filter(app => 
    app.userId?.name?.toLowerCase().includes(searchKeyword.toLowerCase()) || 
    app.jobId?.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý ứng viên</h2>
        
        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm tên hoặc vị trí..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Ứng viên</th>
                <th className="p-4 font-bold">Vị trí ứng tuyển</th>
                <th className="p-4 font-bold">Ngày nộp</th>
                <th className="p-4 font-bold text-center">Trạng thái</th>
                <th className="p-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-blue-500 font-medium animate-pulse">
                    Đang tải dữ liệu ứng viên...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <User size={40} className="opacity-20" />
                      <p>Chưa có ứng viên nào hoặc không tìm thấy kết quả.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{app.userId?.name || "Ứng viên ẩn danh"}</span>
                        <span className="text-xs text-gray-500">{app.userId?.email || "Không có email"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Briefcase size={16} className="text-blue-400" />
                        <span className="truncate max-w-[200px]" title={app.jobId?.title}>{app.jobId?.title || "Công việc đã xóa"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        {dayjs(app.createdAt).format("DD/MM/YYYY")}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight border ${
                        app.status === "Từ chối" ? "bg-red-50 text-red-600 border-red-100" :
                        app.status === "Phù hợp" ? "bg-green-50 text-green-600 border-green-100" :
                        app.status === "Hẹn phỏng vấn" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        "bg-amber-50 text-amber-600 border-amber-100" // Mặc định là Đang chờ duyệt (Vàng cam)
                      }`}>
                        {app.status === "Đã ứng tuyển" ? "ĐANG CHỜ DUYỆT" : app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Dropdown Đổi trạng thái */}
                        <select 
                          value={app.status}
                          onChange={(e) => handleChangeStatus(app._id, e.target.value)}
                          className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                        >
                          <option value="Đã ứng tuyển" disabled>Đang chờ duyệt</option>
                          <option value="Phù hợp">Duyệt - Phù hợp</option>
                          <option value="Hẹn phỏng vấn">Hẹn phỏng vấn</option>
                          <option value="Từ chối">Từ chối</option>
                        </select>

                        {/* Nút xem CV - Bạn có thể tùy chỉnh tính năng này sau */}
                        <button 
                          onClick={() => window.open(app.userCvUrl, "_blank")}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 p-1.5 rounded-lg transition-colors"
                          title="Xem CV"
                        >
                          <CheckCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;