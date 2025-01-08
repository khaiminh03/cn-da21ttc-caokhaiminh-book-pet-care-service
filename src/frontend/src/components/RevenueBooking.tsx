import { useState, useEffect, useMemo } from 'react';
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
    gia: number; // Thêm trường gia
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

    // Tính toán tổng doanh thu của từng dịch vụ
    const revenueByService = useMemo(() => {
        const revenue: Record<string, number> = {};
        bookings.forEach((booking) => {
            if (booking.id_dichvu?.gia && booking.trang_thai === "Hoàn thành") {
                const serviceName = booking.id_dichvu.ten_dich_vu;
                revenue[serviceName] = (revenue[serviceName] || 0) + booking.id_dichvu.gia;
            }
        });
        return revenue;
    }, [bookings]);

    // Tính tổng doanh thu
    const totalRevenue = useMemo(() => {
        return bookings.reduce((total, booking) => {
            if (booking.id_dichvu?.gia && booking.trang_thai === "Hoàn thành") {
                total += booking.id_dichvu.gia;
            }
            return total;
        }, 0);
    }, [bookings]);

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h1 className="text-4xl font-bold font-serif mb-8 text-gray-800">Quản lý doanh thu</h1>
            {loading ? (
                <p className="text-center text-xl text-gray-600">Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <>
                   
                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tên Dịch Vụ</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tên Người Dùng</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Trạng Thái</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Giá</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Doanh Thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? (
                                    bookings.map((booking, index) => (
                                        <tr
                                            key={booking._id}
                                            className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition duration-200`}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-800">{booking.id_dichvu?.ten_dich_vu || 'Không có thông tin'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{booking.id_nguoidung?.ten_hien_thi || 'Không có thông tin'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-2 text-sm font-semibold rounded-md ${booking.trang_thai === 'Hoàn thành' ? 'bg-green-100 text-green-600' : booking.trang_thai === 'Đã hủy' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {booking.trang_thai}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{booking.id_dichvu?.gia || 0} VNĐ</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {revenueByService[booking.id_dichvu?.ten_dich_vu || ''] || 0} VNĐ
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
                    <div className="mb-2 ">
                        <p className="text-xl font-semibold text-green-600 uppercase">Tổng Doanh Thu: {totalRevenue} VNĐ</p>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-xl font-semibold text-gray-800">Tổng Doanh Thu Theo Dịch Vụ</h2>
                        <ul className="list-disc pl-6">
                            {Object.entries(revenueByService).map(([serviceName, revenue]) => (
                                <li key={serviceName} className="text-lg text-gray-700">
                                    {serviceName}: {revenue} VNĐ
                                </li>
                            ))}
                        </ul>
                        
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageBookings;
