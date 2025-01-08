import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Pet {
  _id: string;
  ten: string;
  loai: string;
  tuoi: number;
  hinh_anh: string | File;
}

const PetUser: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchPets = async () => {
      if (!user._id) {
        alert('Bạn cần đăng nhập để xem thú cưng!');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/pets/user/${user._id}`);
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, [user._id]);

  const handleEditClick = (pet: Pet) => {
    setEditingPet({ ...pet });
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa thú cưng này không?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/pets/${id}`);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== id));
      alert('Xóa thành công!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Có lỗi xảy ra khi xóa thú cưng.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingPet) {
      const { name, value, type } = e.target;
      const updatedValue = type === 'number' ? parseInt(value, 10) : value;
      setEditingPet({ ...editingPet, [name]: updatedValue });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingPet && e.target.files && e.target.files[0]) {
      setEditingPet({ ...editingPet, hinh_anh: e.target.files[0] });
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editingPet) return;

    const formData = new FormData();
    formData.append('ten', editingPet.ten);
    formData.append('loai', editingPet.loai);
    formData.append('tuoi', editingPet.tuoi.toString());

    if (editingPet.hinh_anh instanceof File) {
      formData.append('hinh_anh', editingPet.hinh_anh);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/pets/${editingPet._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setPets((prev) =>
        prev.map((pet) =>
          pet._id === editingPet._id ? response.data : pet
        )
      );
      setEditingPet(null);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {editingPet ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sửa thông tin thú cưng</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateSubmit();
            }}
          >
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Tên</label>
              <input
                type="text"
                name="ten"
                value={editingPet.ten}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Loại</label>
              <select
                name="loai"
                value={editingPet.loai}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Tuổi</label>
              <input
                type="number"
                name="tuoi"
                value={editingPet.tuoi}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Hình ảnh</label>
              <input
                type="file"
                name="hinh_anh"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-serif mb-6">DANH SÁCH THÚ CƯNG</h2>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Hình ảnh</th>
                <th className="px-6 py-4 text-left">Tên</th>
                <th className="px-6 py-4 text-left">Loại</th>
                <th className="px-6 py-4 text-left">Tuổi</th>
                <th className="px-6 py-4 text-left">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet._id} className="border-b">
                  <td className="px-6 py-4">
                    <img
                      src={
                        typeof pet.hinh_anh === 'string'
                          ? `http://localhost:5000${pet.hinh_anh}`
                          : URL.createObjectURL(pet.hinh_anh)
                      }
                      alt={pet.ten}
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">{pet.ten}</td>
                  <td className="px-6 py-4">{pet.loai}</td>
                  <td className="px-6 py-4">{pet.tuoi}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditClick(pet)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                    >
                      <i className='bx bxs-edit'></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pet._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2"
                    >
                      <i className='bx bx-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PetUser;
