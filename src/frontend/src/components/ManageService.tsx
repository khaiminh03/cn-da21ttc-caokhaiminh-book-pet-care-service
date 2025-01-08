import React, { useEffect, useState } from "react";
import axios from "axios";

interface Service {
    _id: string;
    ten_dich_vu: string;
    mo_ta: string;
    gia: number;
    thoi_gian: string;
    hinh_anh: string;
    loai_dich_vu: string;
}

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [newService, setNewService] = useState<Partial<Service>>({
        ten_dich_vu: "",
        mo_ta: "",
        gia: 0,
        thoi_gian: "",
        loai_dich_vu: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State để hiển thị hộp thoại xác nhận
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null); // Dịch vụ cần xóa

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:5000/services");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleDelete = async () => {
        if (serviceToDelete) {
            try {
                await axios.delete(`http://localhost:5000/services/${serviceToDelete}`);
                setServices(services.filter((service) => service._id !== serviceToDelete));
                setShowDeleteConfirm(false); // Ẩn hộp thoại xác nhận
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        }
    };

    const handleSave = async () => {
        setError(null); // Reset lỗi
        const formData = new FormData();
        formData.append("ten_dich_vu", newService.ten_dich_vu || "");
        formData.append("mo_ta", newService.mo_ta || "");
        formData.append("gia", newService.gia?.toString() || "0");
        formData.append("thoi_gian", newService.thoi_gian || "");
        formData.append("loai_dich_vu", newService.loai_dich_vu || "");

        if (imageFile) {
            formData.append("hinh_anh", imageFile); // Đính kèm file ảnh
        }

        try {
            if (selectedService) {
                // Cập nhật dịch vụ
                await axios.put(
                    `http://localhost:5000/services/${selectedService._id}/with-image`, // Đảm bảo endpoint đúng
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                // Thêm mới dịch vụ
                await axios.post("http://localhost:5000/services/create", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            resetForm();
            fetchServices(); // Lấy lại danh sách dịch vụ
        } catch (error: any) {
            console.error("Error saving service:", error);
            setError(error.response?.data?.message || "Đã xảy ra lỗi!");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); // Lưu file ảnh vào state
        }
    };

    const resetForm = () => {
        setFormVisible(false);
        setSelectedService(null);
        setImageFile(null);
        setError(null);
        setNewService({
            ten_dich_vu: "",
            mo_ta: "",
            gia: 0,
            thoi_gian: "",
            loai_dich_vu: "",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý dịch vụ</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => {
                    resetForm();
                    setFormVisible(true);
                }}
            >
                Thêm dịch vụ
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <div
                        key={service._id}
                        className="border p-4 rounded shadow hover:shadow-lg transition"
                    >
                        <img
                            src={
                                service.hinh_anh
                                    ? `http://localhost:5000${service.hinh_anh}`
                                    : "/img/default-service.png"
                            }
                            alt={service.ten_dich_vu}
                            className="w-full h-32 object-contain rounded mb-4"
                        />
                        <h2 className="text-xl font-semibold">{service.ten_dich_vu}</h2>
                        <p>{service.mo_ta}</p>
                        <p className="text-sm text-gray-500">Giá: {service.gia} VND</p>
                        <p className="text-sm text-gray-500">Loại: {service.loai_dich_vu}</p>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-green-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    setSelectedService(service);
                                    setNewService(service);
                                    setFormVisible(true);
                                }}
                            >
                                <i className='bx bxs-edit'></i>
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    setServiceToDelete(service._id); // Lưu ID của dịch vụ cần xóa
                                    setShowDeleteConfirm(true); // Hiển thị hộp thoại xác nhận
                                }}
                            >
                                <i className='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {formVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
                        </h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {/* Form input */}
                        <input
                            type="text"
                            placeholder="Tên dịch vụ"
                            value={newService.ten_dich_vu || ""}
                            onChange={(e) =>
                                setNewService({ ...newService, ten_dich_vu: e.target.value })
                            }
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={newService.mo_ta || ""}
                            onChange={(e) =>
                                setNewService({ ...newService, mo_ta: e.target.value })
                            }
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Giá"
                            value={newService.gia || 0}
                            onChange={(e) =>
                                setNewService({ ...newService, gia: Number(e.target.value) })
                            }
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Thời gian"
                            value={newService.thoi_gian || ""}
                            onChange={(e) =>
                                setNewService({ ...newService, thoi_gian: e.target.value })
                            }
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Loại dịch vụ"
                            value={newService.loai_dich_vu || ""}
                            onChange={(e) =>
                                setNewService({ ...newService, loai_dich_vu: e.target.value })
                            }
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSave}
                            >
                                {selectedService ? "Cập nhật" : "Thêm mới"}
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={resetForm}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Xác nhận xóa dịch vụ</h2>
                        <p>Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Xóa
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceList;
