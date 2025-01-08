import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Lbook = () => {
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [detailBooking, setDetailBooking] = useState<any | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Không tìm thấy User ID trong localStorage');
      return;
    }
    fetchBookingHistory(userId);
  }, []);

  const fetchBookingHistory = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/book-service/history/${userId}`);
      if (!response.ok) {
        throw new Error('API phản hồi không hợp lệ');
      }
      const data = await response.json();
      if (data.success) {
        setBookingHistory(data.data);
      } else {
        setError('Không có lịch sử đặt dịch vụ');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Lỗi khi tải lịch sử đặt dịch vụ: ${error.message}`);
      } else {
        setError('Lỗi không xác định');
      }
    }
  };

  const handleRateAndComment = (booking: any) => {
    if (booking.trang_thai === 'Hoàn thành') {
      setSelectedBooking(booking);
    } else {
      toast.warning('Dịch vụ chưa hoàn thành, không thể đánh giá.');
    }
  };

  const handleViewDetails = async (booking: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Không tìm thấy User ID trong localStorage');
        return;
      }

      const response = await fetch(`http://localhost:5000/book-service/history/${userId}`);
      if (!response.ok) {
        throw new Error('Không thể lấy chi tiết dịch vụ');
      }

      const data = await response.json();
      if (data.success) {
        // Sử dụng `_id` của booking để tìm chi tiết chính xác
        const bookingDetail = data.data.find((item: any) => item._id === booking._id);
        if (bookingDetail) {
          setDetailBooking(bookingDetail);
        } else {
          toast.error('Không tìm thấy chi tiết dịch vụ.');
        }
      } else {
        toast.error('Không tìm thấy dữ liệu từ API.');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải chi tiết dịch vụ.');
    }
  };

  const handleSubmitRating = async () => {
    if (!rating || !comment) {
      toast.error('Vui lòng nhập đánh giá và bình luận');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Không tìm thấy User ID trong localStorage');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_nguoidung: userId,
          id_dichvu: selectedBooking?.id_dichvu._id,
          so_sao: parseInt(rating),
          binh_luan: comment,
          id_booking: selectedBooking?._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Không thể thêm đánh giá');
        return;
      }

      const updateResponse = await fetch(`http://localhost:5000/reviews/status/${data._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trang_thai: 'Đã đánh giá',
        }),
      });

      const updateData = await updateResponse.json();
      if (!updateResponse.ok) {
        toast.error(updateData.message || 'Không thể cập nhật trạng thái');
        return;
      }

      toast.success('Cảm ơn bạn đã đánh giá dịch vụ!');
      setRating('');
      setComment('');
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  const handleCancelBooking = async (booking: any) => {
    if (booking.trang_thai === 'Đã hủy') {
      toast.warning('Dịch vụ này đã bị hủy trước đó.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Không tìm thấy User ID trong localStorage');
      return;
    }

    console.log('Hủy dịch vụ với id là:', booking._id); // Log booking._id
    try {
      // Hủy dịch vụ
      const cancelResponse = await fetch(`http://localhost:5000/book-service/cancel/${booking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_nguoidung: userId,
          trang_thai: 'Đã hủy', // Cập nhật trạng thái booking thành "Đã hủy"
        }),
      });

      const cancelData = await cancelResponse.json();

      if (!cancelResponse.ok) {
        toast.error(cancelData.message || 'Không thể hủy dịch vụ');
        return;
      }

      console.log('Booking canceled:', cancelData); // Log cancelData to check the response

      // Kiểm tra id_nhanvien có tồn tại trong booking hay không
      if (!booking.id_nhanvien) {
        toast.error('Không tìm thấy thông tin nhân viên trong booking.');
        return;
      }

      // Cập nhật trạng thái của nhân viên về rảnh
      const updateEmployeeResponse = await fetch(`http://localhost:5000/employee/${booking.id_nhanvien}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trang_thai: 'rảnh',
        }),
      });

      const updateEmployeeData = await updateEmployeeResponse.json();

      if (!updateEmployeeResponse.ok) {
        toast.error(updateEmployeeData.message || 'Không thể cập nhật trạng thái nhân viên');
        return;
      }

      // Cập nhật lại lịch sử đặt dịch vụ trong giao diện
      setBookingHistory((prevHistory) =>
        prevHistory.map((item) =>
          item._id === booking._id ? { ...item, trang_thai: 'Đã hủy' } : item
        )
      );

      toast.success('Dịch vụ đã được hủy thành công và trạng thái nhân viên đã được cập nhật.');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi hủy dịch vụ.');
      console.error(error);
    }
  };


  return (
    <div className="container mx-auto p-6">
      {error && <p className="text-red-500">{error}</p>}
      <h2 className="text-3xl font-serif mb-6">Lịch sử đặt dịch vụ</h2>
      {bookingHistory.length === 0 ? (
        <p className="text-gray-500">Không có lịch sử đặt dịch vụ.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dịch vụ</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thú cưng</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời gian</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nhân viên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.map((booking, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{booking.id_dichvu?.ten_dich_vu || 'Không có dịch vụ'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.ten_thu_cung || 'Không có thú cưng'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.trang_thai}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(booking.ngay_gio).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.ten_nhanvien || 'Không có nhân viên'}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                  >
                    Xem chi tiết
                  </button>
                  {booking.trang_thai === 'Hoàn thành' && (
                    <button
                      onClick={() => handleRateAndComment(booking)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Đánh giá
                    </button>
                  )}
                  {booking.trang_thai === 'Chờ xác nhận' && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Hủy dịch vụ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal chi tiết dịch vụ */}
      {detailBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-[400px] w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Chi tiết dịch vụ</h3>
            <p><strong>Tên dịch vụ:</strong> {detailBooking.id_dichvu?.ten_dich_vu || 'Không có dịch vụ'}</p>
            <p><strong>Giá dịch vụ:</strong> {detailBooking.id_dichvu?.gia || 'Không có giá'}</p>
            <p><strong>Thời gian:</strong> {detailBooking.id_dichvu?.thoi_gian || 'Không có thời gian'}</p>
            <p><strong>Thú cưng:</strong> {detailBooking.ten_thu_cung || 'Không có thú cưng'}</p>
            <p><strong>Loại:</strong> {detailBooking.loai_thu_cung || 'Không có loại'}</p>
            <p><strong>Tuổi:</strong> {detailBooking.tuoi_thu_cung || 'Không có tuổi'}</p>
            <p><strong>Ngày giờ:</strong> {new Date(detailBooking.ngay_gio).toLocaleString()}</p>
            <p><strong>Ghi chú:</strong> {detailBooking.ghi_chu || 'Không có ghi chú'}</p>
            <button
              onClick={() => setDetailBooking(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal đánh giá */}
      {selectedBooking && (
        <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Đánh giá dịch vụ</h3>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Điểm đánh giá (1-5):</label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1 px-4 py-2 border rounded-lg w-full"
              min={1}
              max={5}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Bình luận:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 px-4 py-2 border rounded-lg w-full"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmitRating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Gửi đánh giá
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Lbook;
