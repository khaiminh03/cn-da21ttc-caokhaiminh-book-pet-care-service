import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify

const UpdateUserForm = () => {
  const [userData, setUserData] = useState({
    ten_dang_nhap: '',  // Tên đăng nhập không cho sửa
    email: '',
    sdt: '',
    dia_chi: '',
    ten_hien_thi: '',
    anh_dai_dien: null, // Đảm bảo anh_dai_dien là kiểu null hoặc File
  });

  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

  // Fetch thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/user/${userId}`);
          console.log('Dữ liệu người dùng:', response.data);  // Kiểm tra dữ liệu trả về
          setUserData({
            ten_dang_nhap: response.data.ten_dang_nhap || '',  // Lấy tên đăng nhập từ API
            email: response.data.email || '',
            sdt: response.data.sdt || '',
            dia_chi: response.data.dia_chi || '',
            ten_hien_thi: response.data.ten_hien_thi || '',
            anh_dai_dien: response.data.anh_dai_dien || null, // Lấy ảnh đại diện từ API
          });
        } catch (error) {
          console.error('Lỗi khi tải thông tin người dùng:', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;

      if (files && files[0]) {
        setUserData((prevData) => ({
          ...prevData,
          [name]: files[0], // Lưu file vào state
        }));
      }
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error('Không tìm thấy ID người dùng');
      return;
    }

    // Không mã hóa mật khẩu ở frontend nữa
    const formData = new FormData();
    formData.append('ten_dang_nhap', userData.ten_dang_nhap); // Thêm tên đăng nhập vào formData
    formData.append('email', userData.email);
    formData.append('sdt', userData.sdt);
    formData.append('dia_chi', userData.dia_chi);
    formData.append('ten_hien_thi', userData.ten_hien_thi);

    if (userData.anh_dai_dien) {
      formData.append('anh_dai_dien', userData.anh_dai_dien);  // Đảm bảo là file
    }

    try {
      const response = await axios.put(`http://localhost:5000/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Thông tin người dùng đã được cập nhật:', response.data);

      // Hiển thị thông báo thành công
      toast.success('Thông tin đã được cập nhật thành công!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reload trang sau khi cập nhật thành công
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi cập nhật người dùng:', error.response ? error.response.data : error.message);
      } else {
        console.error('Lỗi không xác định:', error);
      }

      // Hiển thị thông báo lỗi
      toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className=" text-yellow-500">Tên đăng nhập</label>
          <input
            type="text"
            name="ten_dang_nhap"
            value={userData.ten_dang_nhap}
            readOnly
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="sdt"
            value={userData.sdt}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="dia_chi"
            value={userData.dia_chi}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Tên hiển thị</label>
          <input
            type="text"
            name="ten_hien_thi"
            value={userData.ten_hien_thi}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Ảnh đại diện</label>
          {userData.anh_dai_dien && (
            <img
              src={`http://localhost:5000${userData.anh_dai_dien}`} // Đảm bảo URL đầy đủ
              alt="Avatar"
              className="w-16 h-16 rounded-full mt-2"
            />
          )}
          <input
            type="file"
            name="anh_dai_dien"
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Cập nhật thông tin
        </button>
      </form>

      {/* Toast container để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default UpdateUserForm;
