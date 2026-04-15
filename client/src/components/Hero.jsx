import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react'; // Dùng lucide-react nhẹ và hiện đại hơn

const Hero = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // Gọi logic tìm kiếm truyền từ Home xuống
    onSearch({ title, location });
  };

  return (
    <div className="py-16 text-center bg-linear-to-b from-blue-50 to-white rounded-2xl mb-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Tìm công việc mơ ước của bạn
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Hàng ngàn cơ hội nghề nghiệp đang chờ đón bạn tại BotCV
      </p>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl p-2 gap-2 border border-gray-100">
          {/* Input tìm tên job */}
          <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Tiêu đề công việc, kỹ năng..."
              className="w-full py-3 outline-none text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Input tìm địa điểm */}
          <div className="flex-1 flex items-center px-4">
            <MapPin className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Địa điểm (Tỉnh/Thành)"
              className="w-full py-3 outline-none text-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md active:scale-95"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;