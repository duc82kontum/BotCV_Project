import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Gọi đến đúng cổng 5000 của Backend BotCV_Project
        const response = await axios.get('http://localhost:5000/api/jobs/all');
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách công việc:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Việc làm mới nhất</h2>
          <p className="text-gray-600">Những cơ hội nghề nghiệp tốt nhất dành cho bạn</p>
        </div>
        <button className="text-blue-600 font-semibold hover:underline">
          Xem tất cả
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Chưa có công việc nào được đăng tải.</p>
        </div>
      )}
    </div>
  );
};

export default JobList;