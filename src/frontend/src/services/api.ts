// src/services/api.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ServiceData } from '../types';
import { BookingRequest } from '../types';
import { Booking } from '../types';
import { Review } from '../types/Review';

// Tạo instance axios để dễ dàng quản lý API
const api = axios.create({
  baseURL: 'http://localhost:5000', // Địa chỉ API của bạn
});
// Hàm lấy danh sách dịch vụ
export const fetchServices = async () => {
  try {
    const response = await api.get('/services'); // Lấy dữ liệu từ API
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const login = async (loginDto: { ten_dang_nhap: string, mat_khau: string }) => {
  try {
    // Gửi yêu cầu đăng nhập
    const response = await axios.post('http://localhost:5000/auth/login', loginDto);

    // In ra toàn bộ phản hồi từ API để kiểm tra
    console.log('Phản hồi từ API:', response.data);

    const { access_token, user } = response.data;  // Kiểm tra xem có trả về 'user' hay không

    // Lưu access_token vào localStorage
    localStorage.setItem('access_token', access_token);

    // Giải mã token để lấy userId
    const decodedToken = jwtDecode(access_token);

    // Lấy userId từ decodedToken (giả sử 'sub' là userId trong payload của token)
    const userId = decodedToken.sub;
    if (userId) {
      localStorage.setItem('userId', userId); // Lưu userId vào localStorage
    } else {
      console.error('Không tìm thấy userId trong token');
    }

    // Lưu thông tin người dùng (user) vào localStorage nếu có
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
    } else {
      console.error('Không tìm thấy thông tin người dùng trong phản hồi');
    }

    // Trả về dữ liệu phản hồi
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw new Error('Đăng nhập thất bại');
  }
};

export const bookService = async (bookingData: BookingRequest) => {
  try {
    const response = await axios.post('http://localhost:5000/book-service', bookingData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đặt dịch vụ:', error);
    throw error;
  }
};

export const getPetsByUser = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/pets/user/${userId}`); // Đảm bảo đường dẫn API chính xác
    return response.data; // Trả về dữ liệu thú cưng
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error; // Ném lỗi nếu có lỗi xảy ra
  }
};
// PET

export const createService = async (serviceData: ServiceData) => {
  try {
    const response = await axios.post('/services', serviceData);
    return response.data; // Axios tự động parse JSON
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Cập nhật dịch vụ
export const updateService = async (id: string, serviceData: ServiceData) => {
  try {
    const response = await axios.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Xóa dịch vụ
export const deleteService = async (id: string) => {
  try {
    const response = await axios.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
// nhân viên 
export const fetchEmployees = async () => {
  try {
    const response = await api.get('/employee');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Lấy thông tin nhân viên theo ID
export const fetchEmployeeById = async (id: string) => {
  try {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    throw error;
  }
};

// Tạo nhân viên mới
export const createEmployee = async (employeeData: any) => {
  try {
    const response = await api.post('/employee', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (id: string, employeeData: any) => {
  try {
    const response = await api.put(`/employee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Xóa nhân viên
export const deleteEmployee = async (id: string) => {
  try {
    const response = await api.delete(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// thú cưng 
export const addPet = async (petData: any) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
  });
  return await response.json();
};
// Lấy danh sách booking theo trạng thái
export const getBookingsByStatus = async (status: string): Promise<Booking[]> => {
  const response = await axios.get(`/book-service/status/${status}`);
  return response.data;
};

// Tìm kiếm booking
export const searchBookings = async (keyword: string): Promise<Booking[]> => {
  const response = await axios.get(`/book-service/search?keyword=${keyword}`);
  return response.data;
};

// Cập nhật trạng thái booking
export const updateBookingStatus = async (id: string, newStatus: string): Promise<void> => {
  await axios.patch(`/book-service/${id}/status`, { trang_thai: newStatus });
};

// lịch sử đặt
export const fetchBookingHistory = async (userId: string) => {
  const response = await fetch(`/api/book-service/history/${userId}`);
  if (!response.ok) {
    throw new Error('Lỗi khi lấy lịch sử đặt dịch vụ');
  }
  return response.json();
};
// chi tiết dịch vụ
export const fetchServiceDetail = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch service details');
  }
};
export const createBooking = async (
  userId: string,
  petId: string,
  serviceId: string,
  appointmentDate: string,
  notes: string
) => {
  try {
    // Chuyển đổi appointmentDate sang ISO string (nếu chưa có)
    const isoDate = new Date(appointmentDate).toISOString();

    const response = await axios.post(`http://localhost:5000/book-service`, {
      id_nguoidung: userId,
      id_thucung: petId,
      id_dichvu: serviceId,
      ngay_gio: isoDate, // Đảm bảo gửi ISO string cho ngày giờ
      ghi_chu: notes,
    });
    return response.data;
  } catch (error) {
    throw new Error('Lỗi khi đặt dịch vụ');
  }
};
// src/services/api.ts
export const fetchReviewsForService = async (serviceId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/service/${serviceId}`);
    
    // Check if the response is okay (status 200)
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    // Try parsing the response as JSON
    const data = await response.json();
    
    // Ensure that the data is an array of reviews
    if (Array.isArray(data)) {
      return data as Review[];
    } else {
      throw new Error('Invalid response format');
    }

  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};





export default api;  