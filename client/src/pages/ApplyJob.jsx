import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, CircularProgress 
} from "@mui/material";
import { Clock, MapPin, Briefcase, DollarSign, Building2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import BackButton from '../components/BackButton'; // Import component vừa tạo

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ApplyJob = ({ setShowLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false); 
  const [isApplied, setIsApplied] = useState(false); 
  const [applicationId, setApplicationId] = useState(null); // Lưu ID đơn ứng tuyển thực tế
  
  const { backendUrl, token, userData, role, fetchApplyCount } = useContext(AppContext);

  // Hàm tải dữ liệu chi tiết công việc và trạng thái ứng tuyển
  //
const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.job);
      }

      if (token && role === 'user') {
        const appliedRes = await axios.get(`${backendUrl}/api/apply/check-applied/${id}`, {
          headers: { token }
        });
        
        setIsApplied(appliedRes.data.applied);
        
        // SỬA TẠI ĐÂY: Thử cả 2 cách lấy ID phổ biến để đảm bảo không bị null
        if (appliedRes.data.applied) {
          const appId = appliedRes.data.application?._id || appliedRes.data.applicationId;
          setApplicationId(appId);
          console.log("Đã tìm thấy ID đơn ứng tuyển:", appId); // Dòng này giúp bạn kiểm tra trong Console (F12)
        } else {
          setApplicationId(null);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchJobDetail();
  }, [id, backendUrl, token, role]);

  const handleConfirmApply = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/apply/add`, 
        { jobId: id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Ứng tuyển thành công!");
        setIsApplied(true);
        setOpenConfirm(false);
        
        // CẬP NHẬT: Phải đợi nạp lại dữ liệu để lấy applicationId mới từ Database
        await fetchJobDetail(); 
        
        fetchApplyCount(); // Cập nhật số lượng trên Navbar
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi ứng tuyển");
    }
  };

  const handleConfirmCancel = async () => {
    // Kiểm tra mã đơn trước khi gọi API xóa
    if (!applicationId) {
        return toast.error("Không tìm thấy mã đơn ứng tuyển để hủy! Vui lòng thử lại.");
    }

    try {
      // Gọi API xóa theo ID đơn ứng tuyển giống trang Applications
      const res = await axios.delete(`${backendUrl}/api/apply/delete/${applicationId}`, {
        headers: { token }
      });

      if (res.data.success) {
        toast.success(res.data.message || "Đã hủy ứng tuyển thành công!");
        setIsApplied(false);
        setApplicationId(null);
        setOpenCancel(false);
        fetchApplyCount(); // Cập nhật lại số lượng trên Navbar ngay lập tức
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể hủy đơn lúc này");
    }
  };

  const getLogoUrl = () => {
    if (job?.recruiter?.image) {
      return `${backendUrl}/uploads/${job.recruiter.image}`;
    }
    return null;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <CircularProgress />
      <p className="text-gray-500 animate-pulse">Đang tải chi tiết công việc...</p>
    </div>
  );
  
  if (!job) return <div className="text-center py-20">Công việc không tồn tại.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fadeIn">
      <BackButton className="mb-4" />
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-28 h-28 border-2 border-gray-50 rounded-2xl flex items-center justify-center bg-white overflow-hidden shadow-inner p-2">
          {getLogoUrl() ? (
            <img src={getLogoUrl()} alt="logo" className="w-full h-full object-contain" />
          ) : (
            <Building2 size={48} className="text-gray-300" />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-blue-600 font-bold text-xl mb-4">{job.recruiter?.companyName}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 p-2 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
              <span className="font-bold text-gray-900">
                {job.salary?.negotiable ? "Thỏa thuận" : `${job.salary?.min} - ${job.salary?.max} triệu`}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 p-2 rounded-lg">
              <MapPin size={20} className="text-red-500" />
              <span>{job.district}, {job.provinceCode}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 p-2 rounded-lg text-red-600 font-medium">
              <Clock size={20} />
              <span>Hạn: {job.deadline ? dayjs(job.deadline).format("DD/MM/YYYY") : "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
          {isApplied ? (
            <>
              <div className="bg-green-50 text-green-700 border border-green-200 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                <CheckCircle size={20} /> ĐÃ ỨNG TUYỂN
              </div>
              <button 
                onClick={() => setOpenCancel(true)}
                className="w-full bg-white text-red-600 border border-red-200 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-sm active:scale-95"
              >
                <XCircle size={20} /> HỦY ỨNG TUYỂN
              </button>
            </>
          ) : (
            <button 
              onClick={() => !token ? setShowLogin(true) : setOpenConfirm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-10 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              ỨNG TUYỂN NGAY
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-blue-100 flex items-center gap-2">
              <Briefcase size={22} className="text-blue-600" /> Mô tả công việc
            </h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 border-b pb-2 uppercase text-sm tracking-widest">Thông tin bổ sung</h3>
            <div className="space-y-5">
              {[
                { label: "Cấp bậc", value: job.level },
                { label: "Kinh nghiệm", value: job.experiences },
                { label: "Hình thức", value: job.time },
                { label: "Số lượng", value: `${job.slot} người` }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-blue-600 text-white font-bold p-4 text-center">Xác nhận gửi hồ sơ</DialogTitle>
        <DialogContent className="pt-8 text-center">
          <Typography variant="body1">Bạn đang ứng tuyển vị trí: <strong>{job.title}</strong></Typography>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 gap-2 justify-center">
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Đóng</Button>
          <Button variant="contained" onClick={handleConfirmApply} className="bg-blue-600 px-6 font-bold text-white shadow-none">Xác nhận gửi</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="text-red-600 font-bold p-4 text-center border-b">Hủy ứng tuyển?</DialogTitle>
        <DialogContent className="pt-6 text-center">
          <Typography>Bạn có chắc chắn muốn rút lại hồ sơ cho vị trí <strong>{job.title}</strong> không?</Typography>
        </DialogContent>
        <DialogActions className="p-4 gap-2 justify-center bg-gray-50">
          <Button onClick={() => setOpenCancel(false)} color="inherit" className="font-bold">Giữ lại</Button>
          <Button variant="contained" color="error" onClick={handleConfirmCancel} className="font-bold bg-red-600 px-6 text-white shadow-none">Xác nhận hủy</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplyJob;