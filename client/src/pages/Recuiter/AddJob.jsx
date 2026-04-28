import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const AddJob = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    // Khởi tạo state với các giá trị mặc định khớp chính xác với enum trong JobModel.js
    const [formData, setFormData] = useState({
        title: "",
        category: "Lập trình & IT", // Bạn có thể tùy chỉnh danh mục mặc định
        description: "",
        minSalary: "",
        maxSalary: "",
        negotiable: false,
        provinceCode: "Hồ Chí Minh",
        district: "Quận 1",
        level: "Thực tập", // ['Thực tập', 'Nhân viên', 'Trưởng phòng', 'Quản lý', 'Phó giám đốc', 'Giám đốc']
        experiences: "Không yêu cầu",
        type: "On-site", // ['On-site', 'Remote', 'Hybrid']
        time: "Toàn thời gian", // ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Freelance', 'Khác']
        degree: "Không yêu cầu", // ['Không yêu cầu', 'Trung học', 'Phổ thông', 'Đại học', 'Thạc sĩ', 'Tiến sĩ']
        slot: 1,
        deadline: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Định dạng lại dữ liệu cho khớp với Backend
            const jobData = {
                ...formData,
                minSalary: Number(formData.minSalary),
                maxSalary: Number(formData.maxSalary),
                slot: Number(formData.slot)
            };

            const { data } = await axios.post(`${backendUrl}/api/company/post-job`, jobData, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    token: token 
                }
            });

            if (data.success) {
                toast.success(data.message);
                // Reset form sau khi đăng thành công
                setFormData({
                    ...formData,
                    title: "",
                    description: "",
                    minSalary: "",
                    maxSalary: "",
                    slot: 1,
                    deadline: ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi đăng tin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-black text-blue-600 mb-6 border-b pb-4">Tạo tin tuyển dụng mới</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HÀNG 1: Tiêu đề & Danh mục */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Tiêu đề công việc <span className="text-red-500">*</span></label>
                        <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="VD: Lập trình viên Frontend ReactJS" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Ngành nghề / Danh mục <span className="text-red-500">*</span></label>
                        <input required name="category" value={formData.category} onChange={handleChange} type="text" placeholder="VD: IT - Phần mềm, Kế toán..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>

                    {/* HÀNG 2: Mức lương & Hạn nộp */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Mức lương (Triệu VNĐ)</label>
                        <div className="flex items-center gap-2">
                            <input name="minSalary" value={formData.minSalary} onChange={handleChange} type="number" placeholder="Tối thiểu" className="w-full p-3 border border-gray-200 rounded-xl text-sm" disabled={formData.negotiable} />
                            <span className="text-gray-400">-</span>
                            <input name="maxSalary" value={formData.maxSalary} onChange={handleChange} type="number" placeholder="Tối đa" className="w-full p-3 border border-gray-200 rounded-xl text-sm" disabled={formData.negotiable} />
                        </div>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer w-max">
                            <input name="negotiable" checked={formData.negotiable} onChange={handleChange} type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                            <span className="text-sm font-medium text-gray-600">Lương thỏa thuận</span>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Hạn nộp hồ sơ <span className="text-red-500">*</span></label>
                        <input required name="deadline" value={formData.deadline} onChange={handleChange} type="date" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>

                    {/* HÀNG 3: Địa điểm */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                        <input required name="provinceCode" value={formData.provinceCode} onChange={handleChange} type="text" placeholder="VD: Hồ Chí Minh" className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Quận/Huyện <span className="text-red-500">*</span></label>
                        <input required name="district" value={formData.district} onChange={handleChange} type="text" placeholder="VD: Quận 1" className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                    </div>

                    {/* HÀNG 4: Dropdowns - Tuân thủ chặt chẽ enum */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Cấp bậc</label>
                        <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm outline-none">
                            <option value="Thực tập">Thực tập</option>
                            <option value="Nhân viên">Nhân viên</option>
                            <option value="Trưởng phòng">Trưởng phòng</option>
                            <option value="Quản lý">Quản lý</option>
                            <option value="Phó giám đốc">Phó giám đốc</option>
                            <option value="Giám đốc">Giám đốc</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Hình thức (Type)</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm outline-none">
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* HÀNG 5: Thời gian & Bằng cấp */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Thời gian làm việc</label>
                        <select name="time" value={formData.time} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm outline-none">
                            <option value="Toàn thời gian">Toàn thời gian</option>
                            <option value="Bán thời gian">Bán thời gian</option>
                            <option value="Thực tập">Thực tập</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Bằng cấp</label>
                        <select name="degree" value={formData.degree} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm outline-none">
                            <option value="Không yêu cầu">Không yêu cầu</option>
                            <option value="Trung học">Trung học</option>
                            <option value="Phổ thông">Phổ thông</option>
                            <option value="Đại học">Đại học</option>
                            <option value="Thạc sĩ">Thạc sĩ</option>
                            <option value="Tiến sĩ">Tiến sĩ</option>
                        </select>
                    </div>

                    {/* HÀNG 6: Slot & Kinh nghiệm */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Số lượng cần tuyển <span className="text-red-500">*</span></label>
                        <input required name="slot" value={formData.slot} onChange={handleChange} type="number" min="1" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700 text-sm">Kinh nghiệm yêu cầu <span className="text-red-500">*</span></label>
                        <input required name="experiences" value={formData.experiences} onChange={handleChange} type="text" placeholder="VD: Dưới 1 năm, 1-3 năm..." className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>

                    {/* Mô tả chi tiết */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="font-bold text-gray-700 text-sm">Mô tả công việc & Yêu cầu <span className="text-red-500">*</span></label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="Nhập chi tiết công việc, yêu cầu ứng viên, quyền lợi được hưởng..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"></textarea>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
                    >
                        {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG TIN TUYỂN DỤNG"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;