import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography 
} from "@mui/material";
import { Clock, MapPin, Briefcase, DollarSign, Building2 } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { toast } from "react-toastify";
// Import AppContext để sử dụng token và setShowLogin
import { AppContext } from "../context/AppContext";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ApplyJob = ({ setShowLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  // Lấy dữ liệu tập trung từ AppContext
  const { backendUrl, token, userData, role } = useContext(AppContext);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        // Sử dụng backendUrl từ context
        const res = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công việc:", error);
        toast.error("Không thể tải thông tin công việc");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id, backendUrl]);

  const handleOpenApply = () => {
    // 1. Kiểm tra đăng nhập
    if (!token) {
      toast.warning("Vui lòng đăng nhập để ứng tuyển!");
      setShowLogin(true); // Mở modal đăng nhập ngay lập tức
      return;
    }

    // 2. Kiểm tra phân quyền (Chỉ 'user' mới được ứng tuyển)
    if (role !== 'user') {
      toast.error("Tài khoản tuyển dụng không thể ứng tuyển công việc!");
      return;
    }

    setOpenConfirm(true);
  };

  const handleConfirmApply = async () => {
    try {
      // Gọi API ứng tuyển chính thức
      const res = await axios.post(
        `${backendUrl}/api/user/apply`, 
        { jobId: id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ.");
        setOpenConfirm(false);
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server, vui lòng thử lại.");
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center">Đang tải dữ liệu...</div>;
  if (!job) return <div className="text-center py-20">Công việc không tồn tại hoặc đã bị xóa.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fadeIn">
      {/* Phần đầu: Thông tin chung */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
          {job.recruiter?.logo ? (
            <img src={job.recruiter.logo} alt="logo" className="w-full h-full object-contain" />
          ) : (
            <Building2 size={40} className="text-gray-300" />
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
          <p className="text-blue-600 font-semibold text-lg mb-4">{job.recruiter?.companyName}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-gray-600">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" />
              <span className="font-medium text-gray-900">
                Lương: {job.salary?.negotiable ? "Thỏa thuận" : `${job.salary?.min} - ${job.salary?.max} triệu`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <span>{job.district}, {job.provinceCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-orange-400" />
              <span>Hạn nộp: {dayjs(job.deadline).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenApply}
          className="w-full md:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md"
        >
          ỨNG TUYỂN NGAY
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b flex items-center gap-2">
              <Briefcase size={22} className="text-blue-600" /> Chi tiết công việc
            </h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed job-description"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={22} className="text-blue-600" /> Địa điểm làm việc
            </h2>
            <p className="text-gray-700">{job.address || "Vui lòng xem chi tiết trong mô tả hoặc liên hệ trực tiếp."}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Thông tin bổ sung</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Cấp bậc</p>
                <p className="font-semibold">{job.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kinh nghiệm</p>
                <p className="font-semibold">{job.experiences}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hình thức</p>
                <p className="font-semibold">{job.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số lượng tuyển</p>
                <p className="font-semibold">{job.slot} người</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MUI Dialog Xác nhận Ứng tuyển */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gray-50 font-bold border-b">
          Xác nhận ứng tuyển
        </DialogTitle>
        <DialogContent className="pt-6">
          <Typography variant="body1">
            Bạn đang ứng tuyển vị trí: <br/>
            <strong className="text-blue-600 text-lg">{job.title}</strong>
          </Typography>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
            Họ tên: <strong>{userData?.name}</strong> <br/>
            Email: <strong>{userData?.email}</strong>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmApply}>Gửi hồ sơ</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplyJob;