import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs'; 
import { FileText, Search, Briefcase, Building2, User, Trash2, Filter } from 'lucide-react';

const AdminListApply = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // Thêm state cho bộ lọc

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/applications`, {
        headers: { token } 
      });
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllApplications();
  }, [token]);

  // CHỨC NĂNG MỚI: Xóa hồ sơ
  const handleDelete = async (id) => {
    if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ ứng tuyển này khỏi hệ thống?")) {
      try {
        const { data } = await axios.delete(`${backendUrl}/api/admin/delete-application/${id}`, {
          headers: { token }
        });
        if (data.success) {
          toast.success(data.message);
          fetchAllApplications(); // Tải lại danh sách sau khi xóa
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa hồ sơ");
      }
    }
  };

  // NÂNG CẤP: Lọc dữ liệu theo cả "Tên" và "Trạng thái"
  const filteredData = applications.filter(app => {
    const matchSearch = app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">ĐANG TỔNG HỢP HỒ SƠ TOÀN HỆ THỐNG...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Hồ sơ ứng tuyển tổng hợp</h2>
          <p className="text-gray-500 text-sm font-medium">Toàn hệ thống đang có {applications.length} lượt ứng tuyển</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* NÂNG CẤP: Nút Lọc trạng thái */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              className="pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 ring-blue-100 cursor-pointer appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang chờ duyệt">Đang chờ duyệt</option>
              <option value="Đã xem">Đã xem</option>
              <option value="Chờ phỏng vấn">Chờ phỏng vấn</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>

          {/* Ô Tìm kiếm */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm ứng viên, công việc..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-5">Ứng viên</th>
              <th className="p-5">Vị trí & Công ty</th>
              <th className="p-5">Ngày nộp</th>
              <th className="p-5 text-center">Trạng thái</th>
              <th className="p-5 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.length > 0 ? filteredData.map((app, index) => (
              <tr key={index} className="hover:bg-blue-50/10 transition-all group text-sm">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {app.userId?.name?.charAt(0) || <User size={16}/>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{app.userId?.name || 'N/A'}</p>
                      <p className="text-[11px] text-gray-400">{app.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <p className="font-bold text-gray-700 flex items-center gap-1.5"><Briefcase size={14} className="text-gray-300"/> {app.jobId?.title}</p>
                  <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1.5 uppercase"><Building2 size={12}/> {app.companyId?.companyName}</p>
                </td>
                <td className="p-5 text-xs text-gray-500 font-medium">
                  {dayjs(app.createdAt).format('DD/MM/YYYY')}
                </td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    app.status === 'Từ chối' ? 'bg-red-50 text-red-600' :
                    app.status === 'Chờ phỏng vấn' ? 'bg-green-50 text-green-600' :
                    app.status === 'Đã xem' ? 'bg-blue-50 text-blue-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <a 
                      href={`${backendUrl}${app.userCvUrl}`} 
                      target="_blank" rel="noreferrer"
                      className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                      title="Xem CV"
                    >
                      <FileText size={18} />
                    </a>
                    {/* NÚT XÓA HỒ SƠ */}
                    <button 
                      onClick={() => handleDelete(app._id)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                      title="Xóa hồ sơ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400 font-medium italic">
                  Không tìm thấy hồ sơ nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListApply;