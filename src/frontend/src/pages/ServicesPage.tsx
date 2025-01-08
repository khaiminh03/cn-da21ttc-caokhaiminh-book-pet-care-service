import React, { useEffect, useState } from 'react';
import { fetchServices } from '../services/api'; // Import hàm fetchServices

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]); // Trạng thái lưu trữ danh sách dịch vụ
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  useEffect(() => {
    // Gọi hàm fetchServices khi component mount
    const getServices = async () => {
      try {
        const data = await fetchServices(); // Lấy dữ liệu từ API
        setServices(data); // Cập nhật danh sách dịch vụ
        setLoading(false); // Đặt trạng thái loading thành false
      } catch (err) {
        setError('Có lỗi khi tải dịch vụ');
        setLoading(false);
      }
    };

    getServices(); // Gọi hàm fetch
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi dữ liệu đang được tải
  }

  if (error) {
    return <div>{error}</div>; // Hiển thị lỗi nếu có
  }

  return (
    <div>
      <h1>Danh sách Dịch Vụ</h1>
      <ul>
        {services.map((service, index) => (
          <li key={index}>{service.name}</li> // Hiển thị tên dịch vụ (hoặc bất kỳ trường nào từ response)
        ))}
      </ul>
    </div>
  );
};

export default ServicesPage;
