import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Import useAuth từ context
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify

const LoginForm = () => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, setUserRole } = useAuth();  // Sử dụng context để cập nhật trạng thái đăng nhập

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginDto = { ten_dang_nhap: tenDangNhap, mat_khau: matKhau };
      const response = await login(loginDto);
      console.log('Đăng nhập thành công', response);

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('user', JSON.stringify(response.user));

      // Cập nhật trạng thái đăng nhập trong context
      setIsAuthenticated(true);
      setUser(response.user);
      setUserRole(response.user.id_vaitro);
      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Điều hướng sang trang quản lý nếu userRole là id_vaitro
      if (response.user.id_vaitro === '675029a23db47ccd373fb211') {
        navigate('/qlnguoidung'); // Chuyển hướng đến trang quản lý người dùng
      } else {
        navigate('/trangchu'); // Chuyển hướng đến trang chủ
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');

      // Hiển thị thông báo lỗi
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }

    if (e.target.name === 'tenDangNhap') {
      setTenDangNhap(e.target.value);
    } else if (e.target.name === 'matKhau') {
      setMatKhau(e.target.value);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              name="tenDangNhap"
              value={tenDangNhap}
              onChange={handleInputChange}
              placeholder="Tên đăng nhập"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="matKhau"
              value={matKhau}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginForm;
