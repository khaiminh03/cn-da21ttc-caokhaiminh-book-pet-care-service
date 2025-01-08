import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Định nghĩa các giá trị mà context sẽ cung cấp
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  userRole: string | null;  // Thêm trường cho vai trò người dùng
  setUserRole: (role: string | null) => void;  // Hàm để cập nhật vai trò người dùng
}

// Khởi tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo AuthProvider để cung cấp context cho các component con
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);  // Thêm state cho userId
  const [userRole, setUserRole] = useState<string | null>(null);

  // Lấy thông tin từ localStorage khi ứng dụng tải lại
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUser && storedAccessToken) {
      const userData = JSON.parse(storedUser);
      setUser(userData);  // Lấy thông tin người dùng từ localStorage
      setAccessToken(storedAccessToken);  // Lấy access_token từ localStorage
      setUserId(userData._id);  // Lưu userId vào state
      setUserRole(userData.id_vaitro || storedUserRole); // Lưu id_vaitro vào userRole
      setIsAuthenticated(true);  // Đánh dấu người dùng đã đăng nhập
    }
  }, []);

  // Lưu thông tin vào localStorage khi có sự thay đổi
  useEffect(() => {
    if (user && accessToken && userRole) {
      localStorage.setItem('user', JSON.stringify(user));  // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('userRole', userRole);  // Lưu access_token vào localStorage
      // Lưu access_token vào localStorage
    }
  }, [user, accessToken, userRole]);
  // Lưu userRole vào localStorage khi có sự thay đổi
  useEffect(() => {
    if (userRole) {
      console.log('Lưu userRole vào localStorage:', userRole);  // Log giá trị userRole
      localStorage.setItem('userRole', userRole);    // Lưu userRole vào localStorage
    }
  }, [userRole]);
  // Lưu userId vào localStorage khi có sự thay đổi
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);  // Lưu userId vào localStorage
    }
  }, [userId]);



  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, accessToken, setAccessToken, userId, setUserId, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
