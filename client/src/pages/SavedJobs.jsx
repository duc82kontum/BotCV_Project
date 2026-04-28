import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import BackButton from '../components/BackButton';
import { MapPin, DollarSign, Briefcase, Trash2, Bookmark } from 'lucide-react'; // Thêm icon để UI sinh động hơn

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/saved-jobs`, {
        headers: { token }
      });
      if (data.success) {
        setSavedJobs(data.savedJobs || []); 
      }
    } catch (error) {
      toast.error("Không thể tải danh sách đã lưu");
    } finally {
      setLoading(false);
    }
  };

  // Tính năng bỏ lưu nhanh ngay tại trang danh sách
  const handleRemoveSave = async (e, jobId) => {
    e.stopPropagation(); // Ngăn việc nhảy sang trang chi tiết khi ấn nút xóa
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/save-job`, { jobId }, {
        headers: { token }
      });
      if (data.success) {
        toast.success("Đã bỏ lưu");
        setSavedJobs(prev => prev.filter(job => job._id !== jobId)); // Cập nhật UI ngay lập tức
      }
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  useEffect(() => {
    if (token) fetchSavedJobs();
  }, [token]);

  if (loading) return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-gray-500 font-medium">Đang tìm lại các việc làm bạn quan tâm...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 py-10 min-h-[65vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <BackButton className="mb-2" />
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Bookmark className="text-blue-600" fill="currentColor" size={28} />
            Việc làm đã lưu
            <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {savedJobs?.length || 0} vị trí
            </span>
          </h2>
        </div>
      </div>
      
      {savedJobs && savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {savedJobs.map((job) => (
            <div 
              key={job._id} 
              onClick={() => navigate(`/apply-job/${job._id}`)}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Trang trí góc thẻ */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-blue-600 transition-colors duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 bg-white p-2 shadow-sm flex items-center justify-center">
                    <img 
                      src={job.recruiter?.image 
                        ? `${backendUrl}/uploads/${job.recruiter.image}` 
                        : '/default_company.png'
                      } 
                      className="max-w-full max-h-full object-contain" 
                      alt="logo" 
                      onError={(e) => { e.target.src = '/default_company.png'; }}
                    />
                  </div>
                  <button 
                    onClick={(e) => handleRemoveSave(e, job._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Bỏ lưu"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1">
                  {job.recruiter?.companyName}
                </p>

                <div className="space-y-2 border-t pt-4 border-gray-50">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="text-red-400" />
                    <span className="truncate">{job.provinceCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="font-bold text-gray-900">
                       {job.salary?.negotiable ? "Thỏa thuận" : `${job.salary?.min}-${job.salary?.max}tr`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Briefcase size={16} className="text-blue-400" />
                    <span>{job.level}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end">
                  <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem chi tiết <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-inner animate-fadeIn">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark size={40} className="text-blue-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Danh sách đang trống</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">
            Bạn chưa lưu công việc nào. Hãy khám phá hàng ngàn cơ hội nghề nghiệp ngay!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            Tìm việc ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;