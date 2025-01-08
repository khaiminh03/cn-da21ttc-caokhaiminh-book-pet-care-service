import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Employee {
    _id?: string;
    ten: string;
    sdt: string;
    email: string;
    dia_chi: string;
    trang_thai: string;
}

const App: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<Employee>({
        ten: '',
        sdt: '',
        email: '',
        dia_chi: '',
        trang_thai: 'rảnh',
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch all employees from API
    useEffect(() => {
        axios.get('http://localhost:5000/employee')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, trang_thai: 'rảnh' };

        if (employeeToEdit && employeeToEdit._id) {
            // Update employee
            axios.put(`http://localhost:5000/employee/${employeeToEdit._id}`, dataToSubmit)
                .then(response => {
                    setEmployees(prev => prev.map(emp => emp._id === response.data._id ? response.data : emp));
                    setEmployeeToEdit(null);
                    setFormData({ ten: '', sdt: '', email: '', dia_chi: '', trang_thai: 'rảnh' });
                    setIsModalOpen(false);  // Close modal after submission
                })
                .catch(error => console.error('Error updating employee:', error));
        } else {
            // Create new employee
            axios.post('http://localhost:5000/employee', dataToSubmit)
                .then(response => {
                    setEmployees(prev => [...prev, response.data]);
                    setFormData({ ten: '', sdt: '', email: '', dia_chi: '', trang_thai: 'rảnh' });
                    setIsModalOpen(false);  // Close modal after submission
                })
                .catch(error => console.error('Error creating employee:', error));
        }
    };

    const handleDelete = (id: string) => {
        axios.delete(`http://localhost:5000/employee/${id}`)
            .then(() => setEmployees(prev => prev.filter(emp => emp._id !== id)))
            .catch(error => console.error('Error deleting employee:', error));
    };

    const handleEdit = (employee: Employee) => {
        setEmployeeToEdit(employee);
        setFormData(employee);
        setIsModalOpen(true);  // Open modal for editing
    };

    const handleAddNew = () => {
        setEmployeeToEdit(null);  // Reset form for new employee
        setFormData({ ten: '', sdt: '', email: '', dia_chi: '', trang_thai: 'rảnh' });
        setIsModalOpen(true);  // Open modal for adding new employee
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Close modal
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý nhân viên</h1>

            {/* Add New Employee Button */}
            <button
                onClick={handleAddNew}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Thêm nhân viên
            </button>

            {/* Employee List */}
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Tên</th>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Số điện thoại</th>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Email</th>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Địa chỉ</th>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Trạng thái</th>
                            <th className="py-3 px-4 text-left border-b text-sm font-semibold text-gray-600">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{employee.ten}</td>
                                <td className="py-3 px-4 border-b">{employee.sdt}</td>
                                <td className="py-3 px-4 border-b">{employee.email}</td>
                                <td className="py-3 px-4 border-b">{employee.dia_chi}</td>
                                <td className="py-3 px-4 border-b">{employee.trang_thai}</td>
                                <td className="py-3 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(employee)}
                                        className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                                    >
                                        <i className='bx bxs-edit'></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee._id!)}
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                    >
                                        <i className='bx bx-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit Employee */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{employeeToEdit ? 'Sửa nhân viên' : 'Thêm mới nhân viên'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block">Tên</label>
                                <input
                                    type="text"
                                    name="ten"
                                    value={formData.ten}
                                    onChange={e => setFormData({ ...formData, ten: e.target.value })}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="sdt"
                                    value={formData.sdt}
                                    onChange={e => setFormData({ ...formData, sdt: e.target.value })}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="dia_chi"
                                    value={formData.dia_chi}
                                    onChange={e => setFormData({ ...formData, dia_chi: e.target.value })}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
                            >
                                {employeeToEdit ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </form>
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white py-2 px-4 rounded mt-4 w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
