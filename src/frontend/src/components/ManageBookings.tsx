import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


// Định nghĩa kiểu dữ liệu
interface User {
  _id: string;
  ten_hien_thi: string;
  dia_chi: string;
  trang_thai: string;
}

interface Pet {
  ten: string;
}

interface Service {
  ten_dich_vu: string;
}

interface Booking {
  _id: string;
  trang_thai: string;
  id_dichvu: Service | null;
  id_thucung: Pet | null;
  id_nguoidung: User | null;
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách tất cả dịch vụ đặt
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/book-service');
        console.log('Dữ liệu nhận được từ API:', response.data);
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setError('Dữ liệu trả về không đúng định dạng');
        }
      } catch (error) {
        console.error('Có lỗi khi lấy danh sách dịch vụ đặt:', error);
        setError('Không thể tải dữ liệu, vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>, bookingId: string, employeeId: string) => {
      const newStatus = event.target.value;

      // Kiểm tra trạng thái hiện tại
      const currentBooking = bookings.find((booking) => booking._id === bookingId);
      if (currentBooking?.trang_thai === "Đã hủy") {
        alert("Trạng thái đã hủy, không thể thay đổi nữa.");
        return; // Không thực hiện nếu trạng thái hiện tại là "Đã hủy"
      }

      // Cập nhật trạng thái ngay lập tức trên UI
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, trang_thai: newStatus } : booking
        )
      );

      try {
        // Gửi yêu cầu PATCH để cập nhật trạng thái đặt dịch vụ
        await axios.patch(`http://localhost:5000/book-service/${bookingId}/status`, { trang_thai: newStatus });

        // Nếu trạng thái là "Hoàn thành" hoặc "Đã hủy", cập nhật trạng thái nhân viên
        if (newStatus === "Hoàn thành" || newStatus === "Đã hủy") {
          console.log(`Cập nhật trạng thái nhân viên ${employeeId} thành "rảnh"`);
          const response = await axios.patch(`http://localhost:5000/employee/${employeeId}/status`, { trang_thai: "rảnh" });
          console.log("Phản hồi từ API khi cập nhật nhân viên:", response.data);
          alert("Cập nhật trạng thái nhân viên thành công!");
        }

        alert("Cập nhật trạng thái dịch vụ thành công!");
      } catch (error) {
        console.error("Có lỗi khi cập nhật trạng thái:", error);
        alert("Cập nhật trạng thái thất bại. Vui lòng thử lại!");

        // Khôi phục trạng thái cũ nếu có lỗi
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, trang_thai: currentBooking?.trang_thai || "Chờ xác nhận" } : booking
          )
        );
      }
    },
    [bookings]
  );

  const handleDelete = async (bookingId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/book-service/${bookingId}`);
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
        alert("Dịch vụ đã được xóa thành công!");
      } catch (error) {
        console.error("Có lỗi khi xóa dịch vụ:", error);
        alert("Xóa dịch vụ thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý đặt dịch vụ</h1>
      {loading ? (
        <p className="text-center text-xl text-gray-600">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tên Dịch Vụ
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tên Thú Cưng
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tên Người Dùng
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Địa Chỉ
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.id_dichvu?.ten_dich_vu || 'Không có thông tin'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.id_thucung?.ten || 'Không có thông tin'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.id_nguoidung?.ten_hien_thi || 'Không có thông tin'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.id_nguoidung?.dia_chi || 'Không có thông tin'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.trang_thai}
                        onChange={(event) => handleStatusChange(event, booking._id, booking.id_nguoidung?._id || '')}
                        className={`border rounded-md px-4 py-2 transition duration-200 ${booking.trang_thai === 'Hoàn thành'
                          ? 'bg-green-100 text-green-600'
                          : booking.trang_thai === 'Đã hủy'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-white'
                          }`}
                        disabled={booking.trang_thai === 'Hoàn thành' || booking.trang_thai === 'Đã hủy'}
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang thực hiện">Đang thực hiện</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring focus:ring-red-300"
                      >
                        <i className='bx bx-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-600">
                    Không có dữ liệu để hiển thị.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default ManageBookings;
