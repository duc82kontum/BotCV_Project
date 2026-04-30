import React from 'react';
// Chỉ sử dụng các icon cơ bản nhất, chắc chắn có trong mọi phiên bản Lucide
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white pt-20 pb-10 mt-auto'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
          {/* CỘT 1: GIỚI THIỆU */}
          <div className='space-y-6'>
            <h1 className='text-3xl font-black text-blue-500 tracking-tighter'>BotCV</h1>
            <p className='text-gray-400 text-sm leading-relaxed'>
              Nền tảng kết nối ứng viên tài năng với các doanh nghiệp hàng đầu. 
              Công cụ hỗ trợ tạo CV chuyên nghiệp và tìm kiếm việc làm hiệu quả nhất.
            </p>
            <div className='flex gap-4'>
              <Globe className='text-gray-500 hover:text-blue-500 cursor-pointer' size={20}/>
            </div>
          </div>

          {/* CỘT 2: CHO ỨNG VIÊN */}
          <div className='space-y-6'>
            <h4 className='font-black uppercase text-[10px] tracking-widest text-blue-500'>Cho Ứng Viên</h4>
            <ul className='space-y-3 text-sm text-gray-400 font-medium'>
              <li className='hover:text-white cursor-pointer'>Tìm kiếm việc làm</li>
              <li className='hover:text-white cursor-pointer'>Tạo CV chuyên nghiệp</li>
              <li className='hover:text-white cursor-pointer'>Cẩm nang nghề nghiệp</li>
            </ul>
          </div>

          {/* CỘT 3: CHO DOANH NGHIỆP[cite: 14] */}
          <div className='space-y-6'>
            <h4 className='font-black uppercase text-[10px] tracking-widest text-blue-500'>Cho Doanh Nghiệp</h4>
            <ul className='space-y-3 text-sm text-gray-400 font-medium'>
              <li className='hover:text-white cursor-pointer'>Đăng tin tuyển dụng</li>
              <li className='hover:text-white cursor-pointer'>Tìm kiếm hồ sơ</li>
              <li className='hover:text-white cursor-pointer'>Quản lý tuyển dụng</li>
            </ul>
          </div>

          {/* CỘT 4: LIÊN HỆ[cite: 14] */}
          <div className='space-y-6'>
            <h4 className='font-black uppercase text-[10px] tracking-widest text-blue-500'>Liên Hệ</h4>
            <div className='space-y-4 text-sm text-gray-400'>
              <div className='flex items-center gap-3 font-medium'><MapPin size={18} className='text-blue-500'/> TP. Hồ Chí Minh</div>
              <div className='flex items-center gap-3 font-medium'><Phone size={18} className='text-blue-500'/> 1900 123 456</div>
              <div className='flex items-center gap-3 font-medium'><Mail size={18} className='text-blue-500'/> support@botcv.vn</div>
            </div>
          </div>
        </div>

        <div className='pt-10 border-t border-gray-800 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]'>
          © 2026 BotCV Project - Bản quyền thuộc về Hoàng Đức Developer[cite: 14]
        </div>
      </div>
    </footer>
  );
};

export default Footer;