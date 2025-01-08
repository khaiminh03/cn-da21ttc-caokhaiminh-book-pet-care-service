import React from 'react';
import { useAuth } from '../contexts/AuthContext';  // Import useAuth từ context
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate từ react-router-dom

const Header: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();  // Lấy trạng thái đăng nhập từ context
  const navigate = useNavigate();  // Khởi tạo hook useNavigate

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);  
    navigate('/trangchu');  
  };

  return (
    <header className="row container">
      <a href="/trangchu">
        <img src="/img/logos.png" alt="Logo" />
      </a>
      <nav className="navigation row">
        <ul className="row">
          <li><a href="/trangchu">Trang chủ</a></li>
          <li><a href={isAuthenticated ? "/thongbao" : "/dichvu"}>{isAuthenticated ? "Thông báo" : "Dịch vụ"}</a></li>
          <li><a href="/thucung">Thú cưng</a></li> {/* Thêm mục Thú cưng */}
          <li><a href={isAuthenticated ? "/ls" : "/lienhe"}>{isAuthenticated ? "Lịch sử đặt dịch vụ" : "Liên hệ"}</a></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login" className="page-btn active">Đăng nhập</Link></li>
              <li><Link to="/sign" className="page-btn">Đăng ký</Link></li>
            </>
          ) : (
            <>
              <li><a href="/thongtinnguoidung">Thông tin người dùng</a></li>
              <li><a href="#" onClick={handleLogout} className="page-btn">Đăng xuất</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
