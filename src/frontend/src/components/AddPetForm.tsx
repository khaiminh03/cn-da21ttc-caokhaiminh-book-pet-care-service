import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddPetForm = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({
    ten: '',
    loai: '',
    tuoi: 0,
    hinh_anh: null, // Đảm bảo hinh_anh là kiểu null hoặc File
    id_nguoidung: '',
  });
  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
      navigate('/login');
    }
  }, [navigate]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Đặt id_nguoidung mặc định nếu chưa có
  if (userId && petData.id_nguoidung === '') {
    setPetData((prevData) => ({
      ...prevData,
      id_nguoidung: userId,
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;

      if (files && files[0]) {
        const file = files[0];
        setPetData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
      } else {
        setPetData((prevData) => ({
          ...prevData,
          [name]: null,
        }));
      }
    } else {
      setPetData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ten', petData.ten);
    formData.append('loai', petData.loai);
    formData.append('tuoi', petData.tuoi.toString());
    formData.append('id_nguoidung', petData.id_nguoidung);

    if (petData.hinh_anh) {
      formData.append('hinh_anh', petData.hinh_anh);
    } else {
      formData.append('hinh_anh', 'Không có ảnh');
    }

    try {
      const response = await axios.post('http://localhost:5000/pets/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      });
      console.log('Thú cưng đã được thêm:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi thêm thú cưng:', error.response ? error.response.data : error.message);
      } else {
        console.error('Lỗi không xác định:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="ten" className="block text-sm font-medium text-gray-700">Tên thú cưng</label>
        <input
          type="text"
          name="ten"
          id="ten"
          value={petData.ten}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="loai" className="block text-sm font-medium text-gray-700">Loại thú cưng</label>
        <select
          name="loai"
          id="loai"
          value={petData.loai}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Chọn loại thú cưng</option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="tuoi" className="block text-sm font-medium text-gray-700">Tuổi</label>
        <input
          type="number"
          name="tuoi"
          id="tuoi"
          value={petData.tuoi}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="hinh_anh" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
        <input
          type="file"
          name="hinh_anh"
          id="hinh_anh"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {petData.hinh_anh === null && <p className="text-sm text-gray-500 mt-2">Không có ảnh</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Thêm thú cưng
      </button>

      <a
        href="/petuser"
        className="block text-center text-indigo-600 mt-4 hover:text-indigo-700"
      >
        Xem danh sách thú cưng
      </a>
    </form>
  );
};

export default AddPetForm;
