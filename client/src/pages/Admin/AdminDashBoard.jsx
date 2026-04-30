import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AdminDashBoard = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [stats, setStats] = useState({ users: 0, companies: 0, jobs: 0, applications: 0 });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, { headers: { token } });
      if (data.success) setStats(data.stats);
    } catch (error) {
      toast.error("Lỗi tải thống kê");
    }
  };

  useEffect(() => { if (token) fetchStats(); }, [token]);

  const cards = [
    { title: 'Người dùng', value: stats.users, icon: '👤', color: 'bg-blue-500' },
    { title: 'Công ty', value: stats.companies, icon: '🏢', color: 'bg-green-500' },
    { title: 'Việc làm', value: stats.jobs, icon: '💼', color: 'bg-purple-500' },
    { title: 'Đơn ứng tuyển', value: stats.applications, icon: '📝', color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê hệ thống thực tế</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white shadow-lg`}>{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
      {/* Bạn có thể thêm biểu đồ Recharts tại đây sau này */}
    </div>
  );
};

export default AdminDashBoard;