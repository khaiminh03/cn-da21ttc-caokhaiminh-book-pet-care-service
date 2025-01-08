// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    mat_khau: '',
    email: '',
    sdt: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/auth/register', formData);
      navigate('/login');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Đăng ký không thành công');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Ký</h2>
      {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên đăng nhập:</label>
          <input
            type="text"
            name="ten_dang_nhap"
            value={formData.ten_dang_nhap}
            onChange={handleChange}
            placeholder="Nhập tên đăng nhập"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mật khẩu:</label>
          <input
            type="password"
            name="mat_khau"
            value={formData.mat_khau}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Số điện thoại:</label>
          <input
            type="text"
            name="sdt"
            value={formData.sdt}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
