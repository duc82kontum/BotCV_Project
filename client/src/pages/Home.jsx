import React from 'react';
import Hero from '../components/Hero';
import JobList from '../components/JobList';

const Home = () => {
  // Hàm xử lý tìm kiếm tạm thời để không bị lỗi prop
  const handleSearch = (filter) => {
    console.log("Tìm kiếm với:", filter);
  };

  return (
    <div className="flex flex-col gap-10">
      <Hero onSearch={handleSearch} />
      <JobList />
    </div>
  );
};

export default Home;