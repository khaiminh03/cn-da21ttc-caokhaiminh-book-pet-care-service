import React, { useState, useEffect } from 'react';
import { fetchServices, getPetsByUser, bookService } from '../services/api'; // Import các hàm API
import { BookingRequest } from '../types'; // Import kiểu BookingRequest
import { useNavigate } from 'react-router-dom';
import { Types } from 'mongoose';
type Service = {
  _id: string;
  ten_dich_vu: string;
  mo_ta: string;
  gia: number;
  thoi_gian: string;
  hinh_anh?: string;
};

type Pet = {
  _id: string;
  ten: string;
  loai: string;
  tuoi: number;
  hinh_anh?: string;
};

const BookService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [petId, setPetId] = useState('');
  const [ngayGio, setNgayGio] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách dịch vụ:', error);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const loadPets = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const petsData = await getPetsByUser(userId);
          setPets(petsData);
        } catch (error) {
          console.error('Lỗi khi tải danh sách thú cưng:', error);
        }
      } else {
        navigate('/login');
      }
    };
    loadPets();
  }, [navigate]);

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceId = event.target.value;
    setServiceId(selectedServiceId);
    const service = services.find((service) => service._id === selectedServiceId);
    setSelectedService(service || null);
  };

  const handlePetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPetId = event.target.value;
    setPetId(selectedPetId);
    const pet = pets.find((pet) => pet._id === selectedPetId);
    setSelectedPet(pet || null);
  };

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Vui lòng đăng nhập trước khi đặt dịch vụ.');
      return;
    }

    const bookingRequest: BookingRequest = {
      id_nguoidung: new Types.ObjectId(userId),  // Chuyển đổi thành ObjectId
      id_dichvu: new Types.ObjectId(serviceId),  // Chuyển đổi thành ObjectId
      id_thucung: new Types.ObjectId(petId),     // Chuyển đổi thành ObjectId
      ngay_gio: ngayGio,
      ghi_chu: ghiChu,
    };

    try {
      const response = await bookService(bookingRequest);

      if (response.success) {
        alert('Đặt dịch vụ thành công!');
        navigate('/ls');  // Điều hướng đến trang lịch sử đặt dịch vụ
      } else {
        alert('Đặt dịch vụ không thành công!');
      }
    } catch (error) {
      console.error('Đặt dịch vụ thất bại:', error);
      alert('Đặt dịch vụ thất bại!');
    }
  };

  return (
    <form onSubmit={handleBooking} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold font-serif text-gray-800 text-center">ĐẶT DỊCH VỤ CHĂM SÓC THÚ CƯNG</h2>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Chọn dịch vụ</label>
        <select
          id="service"
          value={serviceId}
          onChange={handleServiceChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn dịch vụ</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.ten_dich_vu}
            </option>
          ))}
        </select>
      </div>

      {selectedService && (
        <div className="text-sm text-gray-600">
          <p><strong>Giá:</strong> {selectedService.gia} VND</p>
          <p><strong>Thời gian:</strong> {selectedService.thoi_gian}</p>
        </div>
      )}

      <div>
        <label htmlFor="pet" className="block text-sm font-medium text-gray-700 mb-1">Chọn thú cưng</label>
        <select
          id="pet"
          value={petId}
          onChange={handlePetChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn thú cưng</option>
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.ten}
            </option>
          ))}
        </select>
      </div>

      {selectedPet && (
        <div className="text-sm text-gray-600">
          <p><strong>Loại:</strong> {selectedPet.loai}</p>
          <p><strong>Tuổi:</strong> {selectedPet.tuoi} tuổi</p>
        </div>
      )}

      <div>
        <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">Chọn ngày giờ</label>
        <input
          id="datetime"
          type="datetime-local"
          value={ngayGio}
          onChange={(e) => setNgayGio(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
        <textarea
          id="note"
          value={ghiChu}
          onChange={(e) => setGhiChu(e.target.value)}
          placeholder="Ghi chú (tuỳ chọn)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Đặt dịch vụ
      </button>
    </form>
  );
};

export default BookService;
