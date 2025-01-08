import React, { useEffect, useState } from 'react';

interface ServiceAssignment {
    _id: string;
    id_nhanvien: { ten: string };
    id_dichvu: { ten_dich_vu: string };
    id_nguoidung: { ten_dang_nhap: string };  // Thêm trường ten_dang_nhap
    ngay_gio_phan_cong: string;
}

const ManageAssignments: React.FC = () => {
    const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('http://localhost:5000/serviceassignments');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);  // In dữ liệu ra console để kiểm tra
                setAssignments(data); // Lưu dữ liệu phân công vào state
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý danh sách phân công</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Tên Người Dùng</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Nhân Viên</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Dịch Vụ</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Ngày Giờ Phân Công</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.length > 0 ? (
                            assignments.map((assignment) => (
                                <tr key={assignment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{assignment.id_nguoidung?.ten_dang_nhap || "Chưa có tên đăng nhập"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{assignment.id_nhanvien.ten}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{assignment.id_dichvu.ten_dich_vu}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{new Date(assignment.ngay_gio_phan_cong).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="border px-6 py-4 text-center text-gray-600">Không có phân công dịch vụ nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAssignments;
