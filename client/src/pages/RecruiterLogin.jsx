// import { assets } from "../assets/assets";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
// Import AppContext để lưu token và role
import { AppContext } from "../context/AppContext";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login"); 
  const { backendUrl, setToken, setRole, setUserData } = useContext(AppContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const navigate = useNavigate();

  // Hàm xử lý Đăng nhập / Đăng ký
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        // ĐĂNG NHẬP NHÀ TUYỂN DỤNG
        const { data } = await axios.post(`${backendUrl}/api/company/login`, { email, password });

        if (data.success) {
          // QUAN TRỌNG: Lưu trực tiếp vào localStorage để tránh mất session khi reload (F5)
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', 'recruiter');

          // Cập nhật vào Context State
          setToken(data.token);
          setRole('recruiter');
          setUserData(data.userData);

          toast.success("Đăng nhập thành công!");
          navigate('/dashboard');
        } else {
          toast.error(data.message);
        }
      } else {
        // ĐĂNG KÝ NHÀ TUYỂN DỤNG
        if (password !== rePassword) {
          return toast.error("Mật khẩu xác nhận không khớp!");
        }
        if (!agreeTerms) {
          return toast.error("Bạn phải đồng ý với điều khoản dịch vụ!");
        }

        const { data } = await axios.post(`${backendUrl}/api/company/register`, {
          fullName,
          companyName,
          email,
          password
        });

        if (data.success) {
          toast.success("Đăng ký thành công! Hãy đăng nhập.");
          setState("Login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập/đăng ký:", error);
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-blue-600 tracking-tighter mb-2">
            Bot<span className="text-gray-800">CV</span> Business
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {state === "Login" ? "Chào mừng Nhà tuyển dụng quay trở lại" : "Khởi tạo tài khoản doanh nghiệp của bạn"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Register" && (
            <>
              <TextField
                fullWidth
                label="Họ và tên người đại diện"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Tên công ty / Doanh nghiệp"
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                size="small"
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email công việc"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="small"
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="small"
          />

          {state === "Register" && (
            <>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type="password"
                variant="outlined"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
                size="small"
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)} 
                  color="primary"
                  size="small"
                />
                <span className="text-xs text-gray-600">
                  Tôi đồng ý với các <span className="text-blue-600 cursor-pointer">điều khoản</span> và <span className="text-blue-600 cursor-pointer">chính sách bảo mật</span>.
                </span>
              </div>
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#2563eb",
              py: 1.2,
              mt: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              '&:hover': {
                backgroundColor: "#1d4ed8",
                boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
              }
            }}
          >
            {state === "Login" ? "Đăng nhập ngay" : "Đăng ký tài khoản"}
          </Button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-50">
          <p className="text-sm text-gray-500">
            {state === "Login" ? "Bạn chưa có tài khoản doanh nghiệp?" : "Đã có tài khoản doanh nghiệp?"}{" "}
            <span
              onClick={() => setState(state === "Login" ? "Register" : "Login")}
              className="text-blue-600 font-bold cursor-pointer hover:text-blue-700 underline-offset-4 hover:underline"
            >
              {state === "Login" ? "Đăng ký ngay" : "Đăng nhập tại đây"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;