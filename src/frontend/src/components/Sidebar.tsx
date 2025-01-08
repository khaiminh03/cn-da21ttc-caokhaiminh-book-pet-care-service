import { useState } from "react";
import { useAuth } from '../contexts/AuthContext';  // Import useAuth từ context
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();  // Lấy trạng thái đăng nhập từ context
  const navigate = useNavigate();  // Khởi tạo hook useNavigate

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);  // Cập nhật trạng thái đăng xuất trong context
    navigate('/trangchu');  // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-white fixed top-4 left-4 z-30"
      >
        <i className="bx bx-menu text-2xl"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`w-64  md:w-1/6 bg-green-800 text-white p-6 flex flex-col h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-30`}
      >
        <h2 className="text-2xl font-semibold mb-8 text-center text-yellow-400">
          Quản lý
        </h2>
        <ul className="space-y-4">
          <li>
            <a
              href="/qlnguoidung"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bxs-user"></i>
              </span>
              Quản lý người dùng
            </a>
          </li>
          <li>
            <a
              href="/qlnhanvien"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bxs-user"></i>
              </span>
              Quản lý nhân viên
            </a>
          </li>
          <li>
            <a
              href="/qldichvu"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bx-briefcase"></i>
              </span>
              Quản lý dịch vụ
            </a>
          </li>
          <li>
            <a
              href="/qlphancong"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bx-task"></i>
              </span>
              Quản lý phân công
            </a>
          </li>
          <li>
            <a
              href="/qldatdichvu"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bx-calendar"></i>
              </span>
              Lịch sử đặt dịch vụ
            </a>
          </li>
          <li>
            <a
              href="/qldanhgia"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bx-star"></i>
              </span>
              Quản lý đánh giá
            </a>
          </li>
          <li>
            <a
              href="/qldoanhthu"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className='bx bxs-dollar-circle'></i>
              </span>
              Quản lý doanh thu
            </a>
          </li>
          <li>
            <a
              href="/qlthongbao"
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className='bx bxs-bell'></i>
              </span>
              Quản lý thông báo
            </a>
          </li>
          <li>
            <a
              href="#" onClick={handleLogout}
              className="hover:bg-green-700 p-3 rounded-md transition-all duration-200 flex items-center"
            >
              <span className="mr-3">
                <i className="bx bx-log-out"></i>
              </span>
              Đăng xuất
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
