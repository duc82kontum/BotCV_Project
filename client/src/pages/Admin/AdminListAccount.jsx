import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Search, Trash2, User, Building2, Mail, Phone } from 'lucide-react';

const AdminListAccount = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('user'); // 'user' hoặc 'company'
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Lấy dữ liệu từ Backend
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // Sử dụng route đã định nghĩa trong AdminRoute.js
      const { data } = await axios.get(`${backendUrl}/api/admin/accounts`, {
        headers: { token }
      });
      if (data.success) {
        setUsers(data.users);
        setCompanies(data.companies);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAccounts();
  }, [token]);

  // 2. Xử lý xóa tài khoản
  const handleDelete = async (id, type) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${type === 'user' ? 'Người dùng' : 'Công ty'} này không?`)) {
      try {
        const { data } = await axios.post(`${backendUrl}/api/admin/delete-account`, 
          { id, type }, 
          { headers: { token } }
        );
        if (data.success) {
          toast.success(data.message);
          fetchAccounts(); // Tải lại danh sách
        }
      } catch (error) {
        toast.error("Lỗi khi xóa tài khoản");
      }
    }
  };

  // 3. Lọc dữ liệu theo tìm kiếm
  const displayData = activeTab === 'user' 
    ? users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    : companies.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-blue-600">ĐANG TẢI DỮ LIỆU HỆ THỐNG...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[80vh]">
      {/* Header & Tabs */}
      <div className="p-8 border-b border-gray-50 bg-gray-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Quản lý tài khoản</h2>
            <p className="text-gray-500 text-sm font-medium">Hệ thống đang có {users.length} Ứng viên & {companies.length} Doanh nghiệp</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên, email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-8">
          <button 
            onClick={() => setActiveTab('user')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
          >
            Ứng viên ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'company' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
          >
            Doanh nghiệp ({companies.length})
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="p-6">Thông tin cơ bản</th>
              <th className="p-6">Liên hệ</th>
              <th className="p-6">Ngày tham gia</th>
              <th className="p-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayData.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50/10 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-white shadow-sm overflow-hidden">
                      {item.image ? (
                        <img src={`${backendUrl}${item.image}`} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        activeTab === 'user' ? <User size={20} /> : <Building2 size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm uppercase leading-tight">
                        {activeTab === 'user' ? item.name : item.companyName}
                      </p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${activeTab === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {activeTab === 'user' ? 'Ứng viên' : 'Đối tác'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-[13px] font-medium text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-gray-300"/> {item.email}</span>
                    <span className="flex items-center gap-2"><Phone size={14} className="text-gray-300"/> {item.phone || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-6 text-xs text-gray-400 font-bold uppercase tracking-tighter">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => handleDelete(item._id, activeTab)}
                    className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    title="Xóa tài khoản"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayData.length === 0 && (
          <div className="p-20 text-center text-gray-300 font-bold uppercase text-xs tracking-widest">
            Không tìm thấy tài khoản nào phù hợp
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListAccount;