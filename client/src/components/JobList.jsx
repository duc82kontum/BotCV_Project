import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading để giao diện mượt hơn

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Gọi đến API lấy danh sách job từ Backend
        const response = await axios.get('http://localhost:5000/api/jobs/all');
        
        if (response.data.success) {
          // Chỉ lấy những job có dữ liệu hợp lệ để tránh Crash giao diện
          const validJobs = response.data.jobs.filter(job => job && job.title);
          setJobs(validJobs);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách công việc:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Giao diện khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tìm kiếm cơ hội cho bạn...</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      {/* Header của danh sách việc làm */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Việc làm mới nhất</h2>
          <p className="text-gray-600">Những cơ hội nghề nghiệp tốt nhất dành cho bạn tại BotCV</p>
        </div>
        <button className="px-5 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
          Xem tất cả ({jobs.length})
        </button>
      </div>

      {/* Render danh sách Job bằng vòng lặp map */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 font-medium text-lg">Hiện chưa có công việc nào phù hợp.</p>
          <p className="text-gray-400 text-sm">Vui lòng quay lại sau hoặc làm mới trang.</p>
        </div>
      )}
    </div>
  );
};

export default JobList;