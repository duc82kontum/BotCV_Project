import React from 'react'

const AdminDashBoard = () => {
  // Dữ liệu mẫu để hiển thị tạm thời
  const stats = [
    { id: 1, title: 'Tổng người dùng', value: '1,280', icon: '👤', color: 'bg-blue-500' },
    { id: 2, title: 'Công ty đối tác', value: '450', icon: '🏢', color: 'bg-green-500' },
    { id: 3, title: 'Tin tuyển dụng', value: '3,120', icon: '💼', color: 'bg-purple-500' },
    { id: 4, title: 'Đơn ứng tuyển', value: '12,450', icon: '📝', color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bảng điều khiển hệ thống</h1>

      {/* Grid Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng hoạt động gần đây (Tạm thời) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Hoạt động mới nhất</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Người dùng / Công ty</th>
                <th className="px-6 py-4 font-semibold">Hành động</th>
                <th className="px-6 py-4 font-semibold">Thời gian</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900">Nguyễn Văn A</td>
                <td className="px-6 py-4">Đã nộp CV vào vị trí Frontend Developer</td>
                <td className="px-6 py-4 text-gray-500">2 phút trước</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Thành công</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900">Công ty TechSoft</td>
                <td className="px-6 py-4">Đã đăng tin tuyển dụng mới</td>
                <td className="px-6 py-4 text-gray-500">15 phút trước</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Mới</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900">Trần Thị B</td>
                <td className="px-6 py-4">Cập nhật thông tin tài khoản</td>
                <td className="px-6 py-4 text-gray-500">1 giờ trước</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Đã xong</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard