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
          // 1. Cập nhật State trong Context ngay lập tức
          setToken(data.token);
          setRole(data.role); // Nhận 'recruiter' từ backend trả về
          setUserData(data.userData); // Lưu thông tin gộp (Company + Profile)
          
          // 2. Lưu vào LocalStorage để duy trì phiên đăng nhập khi F5
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role); // role lúc này là 'recruiter'
          
          toast.success("Đăng nhập Nhà tuyển dụng thành công!");
          
          // 3. Chuyển hướng về trang quản lý
          navigate("/dashboard"); 
        } else {
          toast.error(data.message);
        }
      } else {
        // ĐĂNG KÝ NHÀ TUYỂN DỤNG
        if (password !== rePassword) {
          return toast.error("Mật khẩu xác nhận không khớp!");
        }
        if (!agreeTerms) {
          return toast.error("Vui lòng đồng ý với điều khoản dịch vụ!");
        }

        const { data } = await axios.post(`${backendUrl}/api/company/register`, {
          fullName,
          companyName,
          email,
          password,
        });

        if (data.success) {
          toast.success("Đăng ký tài khoản doanh nghiệp thành công! Hãy đăng nhập.");
          setState("Login");
          // Xóa các field đăng ký để user nhập login
          setFullName("");
          setCompanyName("");
          setRePassword("");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">BotCV Business</h1>
          <h2 className="text-xl font-bold text-gray-900">
            {state === "Login" ? "Đăng nhập Nhà tuyển dụng" : "Đăng ký tài khoản Công ty"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Giải pháp tuyển dụng thông minh cho doanh nghiệp
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmitHandler}>
          {state === "Register" && (
            <>
              <TextField
                fullWidth
                label="Họ và tên người đại diện"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Tên công ty"
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                margin="normal"
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email doanh nghiệp"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
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
                margin="normal"
              />
              <div className="flex items-center mt-2">
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  color="primary"
                />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với các điều khoản và chính sách bảo mật.
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
              backgroundColor: "#2563eb", // blue-600
              py: 1.5,
              mt: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: "#1d4ed8", // blue-700
              }
            }}
          >
            {state === "Login" ? "Đăng nhập ngay" : "Tạo tài khoản công ty"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {state === "Login" ? "Doanh nghiệp bạn mới đến BotCV?" : "Đã có tài khoản doanh nghiệp?"}{" "}
            <span
              onClick={() => setState(state === "Login" ? "Register" : "Login")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
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