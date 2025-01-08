import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pet {
  _id: string;
  ten: string;
  loai: string;
  tuoi: number;
  hinh_anh: string;
  id_nguoidung: string;
}

interface UpdatePetFormProps {
  petId: string;  // ID của thú cưng cần cập nhật
}

const UpdatePetForm: React.FC<UpdatePetFormProps> = ({ petId }) => {
  const [petData, setPetData] = useState<Pet>({
    _id: '',
    ten: '',
    loai: '',
    tuoi: 0,
    hinh_anh: '',
    id_nguoidung: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Lấy thông tin thú cưng từ server khi component mount
  useEffect(() => {
    const fetchPetData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/pets/${petId}`);
        setPetData(response.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu thú cưng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [petId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/pets/${petId}`, petData);
      console.log('Cập nhật thú cưng thành công:', response.data);
      // Xử lý sau khi cập nhật thành công (ví dụ: thông báo, điều hướng...)
    } catch (error) {
      console.error('Lỗi khi cập nhật thú cưng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tên thú cưng</label>
        <input
          type="text"
          name="ten"
          value={petData.ten}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Loại thú cưng</label>
        <select name="loai" value={petData.loai} onChange={handleChange}>
          <option value="">Chọn loại thú cưng</option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
        </select>
      </div>
      <div>
        <label>Tuổi</label>
        <input
          type="number"
          name="tuoi"
          value={petData.tuoi}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Hình ảnh</label>
        <input
          type="text"
          name="hinh_anh"
          value={petData.hinh_anh}
          onChange={handleChange}
        />
      </div>
      {/* Không cần nhập id_nguoidung vì đã lấy từ localStorage */}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang cập nhật...' : 'Cập nhật thú cưng'}
      </button>
    </form>
  );
};

export default UpdatePetForm;
