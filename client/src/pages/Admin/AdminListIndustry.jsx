import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Folder, Trash2 } from 'lucide-react';

const AdminListIndustry = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [industries, setIndustries] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // ĐÃ SỬA: Thay đổi endpoint và cách lấy data
  const fetchIndustries = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/list-industry`, { headers: { token } });
      if (data.success) {
        setIndustries(data.data || []); // Lấy mảng dữ liệu từ data.data
      }
    } catch (error) {
      toast.error("Lỗi tải danh mục");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/add-industry`, { name }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        setName('');
        fetchIndustries();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi thêm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchIndustries(); }, [token]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form thêm ngành nghề */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
        <h3 className="text-lg font-black text-gray-800 uppercase mb-4">Thêm ngành nghề</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Tên ngành nghề</p>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100"
              placeholder="Ví dụ: Công nghệ thông tin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận thêm'}
          </button>
        </form>
      </div>

      {/* Danh sách ngành nghề */}
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 uppercase mb-6">Danh mục hiện có ({industries.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {industries.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-blue-100 hover:bg-white transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Folder size={18} />
                </div>
                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminListIndustry;