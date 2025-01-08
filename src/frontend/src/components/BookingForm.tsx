import React, { useState } from 'react';
import { Service } from '../types';

interface BookingFormProps {
  service: Service;
  onClose: () => void; // Đóng form
}

const BookingForm: React.FC<BookingFormProps> = ({ service, onClose }) => {
  const [note, setNote] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Đặt dịch vụ:', {
      serviceId: service._id,
      datetime,
      note,
    });
    onClose(); // Đóng form sau khi đặt dịch vụ
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Đặt dịch vụ: {service.ten_dich_vu}
        </h2>
        <p className="text-gray-600 mb-2">Giá: {service.gia} VND</p>
        <p className="text-gray-600 mb-4">Thời gian thực hiện: {service.thoi_gian}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ:</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú (không bắt buộc)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
