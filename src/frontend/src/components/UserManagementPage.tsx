import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
    _id: string;
    ten_dang_nhap: string;
    ten_hien_thi: string; // Tên hiển thị
    email: string;
    sdt: string;
    dia_chi: string; // Địa chỉ
    anh_dai_dien?: string; // Ảnh đại diện
    createdAt: string; // Ngày tạo
    updatedAt: string; // Ngày cập nhật
}

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]); // Dữ liệu người dùng
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
    const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thông báo thành công
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Người dùng đang xem chi tiết
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Trạng thái mở modal

    // Lấy tất cả người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/user");
                setUsers(response.data);
            } catch (error) {
                setError("Lỗi khi tải người dùng");
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Xóa người dùng
    const deleteUser = async (id: string) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/user/${id}`);
            setUsers(users.filter((user) => user._id !== id)); // Cập nhật lại danh sách người dùng sau khi xóa
            setSuccessMessage("Người dùng đã được xóa thành công."); // Hiển thị thông báo thành công
        } catch (error) {
            setError("Lỗi khi xóa người dùng");
            console.error("Error deleting user:", error);
        }
    };

    // Xem chi tiết người dùng
    const viewUserDetails = (id: string) => {
        const user = users.find((user) => user._id === id);
        if (user) {
            setSelectedUser(user);
            setIsModalOpen(true); // Mở modal khi có người dùng được chọn
        }
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý người dùng</h1>
            {loading ? (
                <div className="text-center text-lg text-gray-500">Đang tải...</div>
            ) : error ? (
                <div className="text-center text-lg text-red-500">{error}</div>
            ) : (
                <div>
                    {successMessage && (
                        <div className="text-center text-lg text-green-500 mb-4">{successMessage}</div>
                    )}
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                        <table className="min-w-full table-auto text-sm text-left text-gray-500">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th className="py-3 px-6">Tên đăng nhập</th>
                                    <th className="py-3 px-6">Tên hiển thị</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Số điện thoại</th>
                                    <th className="py-3 px-6">Địa chỉ</th>
                                    <th className="py-3 px-6">Ngày tạo</th>
                                    <th className="py-3 px-6 text-center">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-6">{user.ten_dang_nhap}</td>
                                        <td className="py-3 px-6">{user.ten_hien_thi}</td>
                                        <td className="py-3 px-6">{user.email}</td>
                                        <td className="py-3 px-6">{user.sdt}</td>
                                        <td className="py-3 px-6">{user.dia_chi}</td>
                                        <td className="py-3 px-6">{new Date(user.createdAt).toLocaleString()}</td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => viewUserDetails(user._id)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                                >
                                                    <i className='bx bx-trash'></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal chi tiết người dùng */}
            {selectedUser && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="User Details"
                    className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto"
                    overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Thông tin người dùng</h2>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {selectedUser.anh_dai_dien && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={`http://localhost:5000${selectedUser.anh_dai_dien}`}
                                    alt="Ảnh đại diện"
                                    className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <p className="text-lg text-gray-700"><strong>Tên đăng nhập:</strong> {selectedUser.ten_dang_nhap}</p>
                            <p className="text-lg text-gray-700"><strong>Tên hiển thị:</strong> {selectedUser.ten_hien_thi}</p>
                            <p className="text-lg text-gray-700"><strong>Email:</strong> {selectedUser.email}</p>
                            <p className="text-lg text-gray-700"><strong>Số điện thoại:</strong> {selectedUser.sdt}</p>
                            <p className="text-lg text-gray-700"><strong>Địa chỉ:</strong> {selectedUser.dia_chi}</p>
                            <p className="text-lg text-gray-700"><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                            <p className="text-lg text-gray-700"><strong>Ngày cập nhật:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={closeModal}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserManagementPage;
