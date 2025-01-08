import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    _id: string;
    noi_dung: string;
    loai_thong_bao: string;
    ngay_gui: string;
    trang_thai: boolean;
}

const NotificationList: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    // Lấy userId từ localStorage trực tiếp
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('Người dùng chưa đăng nhập.');
        }
    }, []);

    // Lấy danh sách thông báo khi đã có userId
    useEffect(() => {
        if (userId) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/notice/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setNotifications(response.data);
                } catch (err) {
                    setError('Có lỗi xảy ra khi lấy thông báo.');
                }
            };

            fetchNotifications();
        }
    }, [userId]);

    // Hàm để cập nhật trạng thái thông báo
    const updateNotificationStatus = async (notificationId: string, status: string) => {
        try {
            const trangThai = status === 'read'; // Trạng thái 'read' là đã đọc
            await axios.put(
                `http://localhost:5000/notice/${notificationId}`,
                { trang_thai: trangThai },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            // Cập nhật trạng thái thông báo trong state
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, trang_thai: trangThai }
                        : notification
                )
            );
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật trạng thái thông báo.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6  via-purple-100 to-pink-100 shadow-xl rounded-xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Danh Sách Thông Báo</h2>
            {error && <p className="text-red-500 text-lg mb-4 text-center">{error}</p>}
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li key={notification._id} className="border-b py-4 px-6 bg-white hover:bg-blue-50 transition-all duration-300 rounded-lg shadow-sm mb-4">
                            <p className="text-lg font-semibold "><strong>Loại:</strong> {notification.loai_thong_bao}</p>
                            <p className="text-md text-gray-600 mt-2"><strong>Nội Dung:</strong> {notification.noi_dung}</p>
                            <p className="text-sm text-gray-500 mt-1"><strong>Ngày Gửi:</strong> {new Date(notification.ngay_gui).toLocaleString()}</p>
                            <div className="mt-4 flex items-center space-x-4">
                                <label htmlFor={`status-${notification._id}`} className="font-medium text-gray-700">Trạng Thái:</label>
                                <select
                                    id={`status-${notification._id}`}
                                    value={notification.trang_thai ? 'read' : 'unread'}
                                    onChange={(e) => updateNotificationStatus(notification._id, e.target.value)}
                                    disabled={notification.trang_thai} // Vô hiệu hóa nếu đã đọc
                                    className={`border-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out hover:border-blue-400
                                        ${notification.trang_thai ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                >
                                    <option value="unread" className="text-yellow-700">Chưa đọc</option>
                                    <option value="read" className="text-green-700">Đã đọc</option>
                                </select>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-lg text-gray-500 mt-6 text-center">Không có thông báo nào.</p>
                )}
            </ul>
        </div>
    );
};

export default NotificationList;
