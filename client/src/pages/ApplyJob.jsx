import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, CircularProgress 
} from "@mui/material";
import { Clock, MapPin, Briefcase, DollarSign, Building2, CheckCircle } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ApplyJob = ({ setShowLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isApplied, setIsApplied] = useState(false); 
  
  const { backendUrl, token, userData, role } = useContext(AppContext);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        // Lấy chi tiết công việc từ api/jobs
        const res = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }

        // SỬA LỖI 404: Gọi đúng endpoint api/apply đã cấu hình trong server.js
        if (token && role === 'user') {
          const appliedRes = await axios.get(`${backendUrl}/api/apply/check-applied/${id}`, {
            headers: { token }
          });
          setIsApplied(appliedRes.data.applied);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id, backendUrl, token, role]);

  const getLogoUrl = () => {
    if (job?.logoName) {
      try {
        return new URL(`../assets/logo cong ty/${job.logoName}`, import.meta.url).href;
      } catch (err) { return null; }
    }
    if (job?.recruiter?.logo) {
      return job.recruiter.logo.startsWith('http') 
        ? job.recruiter.logo 
        : `${backendUrl}/${job.recruiter.logo.replace(/\\/g, "/")}`;
    }
    return null;
  };

  const handleOpenApply = () => {
    if (!token) {
      toast.warning("Vui lòng đăng nhập để ứng tuyển!");
      setShowLogin(true);
      return;
    }
    if (role !== 'user') {
      toast.error("Tài khoản tuyển dụng không thể ứng tuyển!");
      return;
    }
    if (isApplied) {
      toast.info("Bạn đã nộp hồ sơ cho công việc này rồi.");
      return;
    }
    setOpenConfirm(true);
  };

  const handleConfirmApply = async () => {
    try {
      // SỬA LỖI: Gọi đúng endpoint api/apply/add
      const res = await axios.post(
        `${backendUrl}/api/apply/add`, 
        { jobId: id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Ứng tuyển thành công!");
        setIsApplied(true);
        setOpenConfirm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi ứng tuyển");
    }
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
              <span>Hạn: {dayjs(job.deadline).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenApply}
          disabled={isApplied}
          className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
            isApplied 
            ? "bg-green-100 text-green-700 cursor-default border border-green-200" 
            : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1"
          }`}
        >
          {isApplied ? (
            <><CheckCircle size={20} /> ĐÃ ỨNG TUYỂN</>
          ) : (
            "ỨNG TUYỂN NGAY"
          )}
        </button>
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

          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <MapPin size={22} className="text-blue-600" /> Địa điểm làm việc
            </h2>
            <p className="text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-50 italic">
              {job.address || "Chi tiết địa chỉ sẽ được cung cấp khi phỏng vấn."}
            </p>
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
        <DialogTitle className="bg-blue-600 text-white font-bold p-4">
          Xác nhận gửi hồ sơ
        </DialogTitle>
        <DialogContent className="pt-8">
          <Typography variant="body1" className="mb-4">
            Bạn đang thực hiện ứng tuyển vào vị trí: <br/>
            <strong className="text-blue-600 text-xl block mt-1">{job.title}</strong>
          </Typography>
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Thông tin hồ sơ của bạn</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <span>Họ tên:</span> <strong className="text-right">{userData?.name}</strong>
              <span>Email:</span> <strong className="text-right">{userData?.email}</strong>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 italic">
              * Hệ thống sẽ tự động gửi CV đã lưu trong tài khoản của bạn đến nhà tuyển dụng.
            </p>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 gap-2">
          <Button onClick={() => setOpenConfirm(false)} color="inherit" className="font-bold">Hủy</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConfirmApply}
            className="bg-blue-600 font-bold px-6"
          >
            Gửi ứng tuyển
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplyJob;