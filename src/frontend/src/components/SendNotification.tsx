import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NotificationRequest {
    id_nguoidung: string;
    noi_dung: string;
    loai_thong_bao: string;
}

interface User {
    _id: string;
    ten_dang_nhap: string;
}

interface Notification {
    _id: string;
    id_nguoidung: string;
    noi_dung: string;
    loai_thong_bao: string;
    trang_thai: boolean;
    ngay_gui: string;
}

const SendNotification: React.FC = () => {
    const [idNguoiDung, setIdNguoiDung] = useState<string>('');
    const [noiDung, setNoiDung] = useState<string>('');
    const [loaiThongBao, setLoaiThongBao] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user');
                setUsers(response.data);
            } catch (error) {
                setMessage('Có lỗi khi lấy danh sách người dùng.');
            }
        };

        fetchUsers();
    }, []);

    // Lấy tất cả thông báo
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/notice');
                setNotifications(response.data);
            } catch (error) {
                setMessage('Có lỗi khi lấy danh sách thông báo.');
            }
        };

        fetchNotifications();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const notificationData: NotificationRequest = {
            id_nguoidung: idNguoiDung,
            noi_dung: noiDung,
            loai_thong_bao: loaiThongBao,
        };

        try {
            await axios.post('http://localhost:5000/notice', notificationData);
            setMessage('Thông báo đã được gửi thành công!');
            // Cập nhật danh sách thông báo sau khi gửi
            const response = await axios.get('http://localhost:5000/notice');
            setNotifications(response.data);
        } catch (error) {
            setMessage('Có lỗi xảy ra khi gửi thông báo.');
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/notice/${id}`);
            setMessage('Thông báo đã được xóa thành công!');
            // Cập nhật danh sách thông báo sau khi xóa
            const response = await axios.get('http://localhost:5000/notice');
            setNotifications(response.data);
        } catch (error) {
            setMessage('Có lỗi xảy ra khi xóa thông báo.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-serif mb-6 text-center uppercase font-bold">Gửi Thông Báo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID Người Dùng:</label>
                    <select
                        value={idNguoiDung}
                        onChange={(e) => setIdNguoiDung(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Chọn người dùng</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.ten_dang_nhap}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nội Dung:</label>
                    <textarea
                        value={noiDung}
                        onChange={(e) => setNoiDung(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại Thông Báo:</label>
                    <input
                        type="text"
                        value={loaiThongBao}
                        onChange={(e) => setLoaiThongBao(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Gửi Thông Báo
                    </button>
                </div>
            </form>
            {message && (
                <p className="mt-4 text-center text-sm font-medium text-gray-600">{message}</p>
            )}
            <h3 className="text-xl font-serif mt-6 mb-4 text-center font-bold">Danh Sách Thông Báo</h3>
            <ul className="space-y-2">
                {notifications.map((notification) => (
                    <li
                        key={notification._id}
                        className="p-4 border border-gray-300 rounded-md shadow-sm"
                    >
                        <p><strong>Người dùng:</strong> {users.find(user => user._id === notification.id_nguoidung)?.ten_dang_nhap}</p>
                        <p><strong>Nội dung:</strong> {notification.noi_dung}</p>
                        <p><strong>Loại:</strong> {notification.loai_thong_bao}</p>
                        <p><strong>Trạng thái:</strong> {notification.trang_thai ? 'Đã đọc' : 'Chưa đọc'}</p>
                        <p><strong>Ngày gửi:</strong> {new Date(notification.ngay_gui).toLocaleString()}</p>
                        <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Xóa
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SendNotification;
