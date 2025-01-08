import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchServiceDetail, getPetsByUser, createBooking, fetchReviewsForService } from '../services/api';
import { Service, Pet, Review } from '../types';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Hook để chuyển hướng
  const [service, setService] = useState<Service | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPet, setSelectedPet] = useState<string>('');

  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
      navigate('/login');
    }
  }, [navigate]);

  // Load service detail
  useEffect(() => {
    const loadServiceDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchServiceDetail(id);
        setService(data);
      } catch (error) {
        setError('Không thể tải chi tiết dịch vụ.');
        console.error('Lỗi khi tải chi tiết dịch vụ:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServiceDetail();
  }, [id]);

  // Load pets for the user
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
      }
    };
    loadPets();
  }, []);

  // Load reviews for the service
  useEffect(() => {
    const loadReviews = async () => {
      if (id) {
        setLoading(true);
        try {
          const reviewsData = await fetchReviewsForService(id);
          console.log('Dữ liệu bình luận:', reviewsData); // Log dữ liệu review
          setReviews(reviewsData);
        } catch (error) {
          setError('Lỗi khi tải bình luận.');
          console.error('Lỗi khi tải bình luận:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadReviews();
  }, [id]);

  // Handle book service modal
  const handleBookService = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPet('');
  };

  // Handle form submission for booking service
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const appointmentDate = (form.elements.namedItem('appointmentDate') as HTMLInputElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    if (!selectedPet || !appointmentDate) {
      setError('Vui lòng chọn thú cưng và ngày giờ!');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        if (!service?._id) {
          setError('Dịch vụ không hợp lệ!');
          return;
        }

        await createBooking(userId, selectedPet, service._id, appointmentDate, notes);
        setIsModalOpen(false);
        console.log('Thông tin đặt dịch vụ đã được gửi!');
      } else {
        setError('Vui lòng đăng nhập!');
      }
    } catch (error) {
      setError('Lỗi khi đặt dịch vụ. Vui lòng thử lại!');
      console.error('Lỗi khi đặt dịch vụ:', error);
    }
  };

  // Loading state
  if (loading) {
    return <p className="text-center text-lg font-semibold text-gray-600">Đang tải...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  // No service found
  if (!service) {
    return <p className="text-center">Không tìm thấy dịch vụ.</p>;
  }

  return (
    <section className="service-detail py-10 bg-gray-50">
      <div className="container mx-auto px-2">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col lg:flex-row gap-1">
          <div className="service-image-and-description w-full lg:w-1/3">
            <div className="service-image w-full h-[200px] flex justify-center items-center relative overflow-hidden rounded-xl">
              <img
                className="w-auto h-full object-contain"
                src={`${process.env.REACT_APP_API_URL}${service.hinh_anh}`}
                alt={service.ten_dich_vu}
                onError={(e) => {
                  e.currentTarget.src = '/default-service-image.jpg';
                }}
              />
            </div>
            <div className="service-description text-justify mt-4 h-[auto] overflow-auto">
              <p className="text-base text-gray-600">Mô tả : {service.mo_ta}</p>
            </div>
          </div>
          <div className="service-info flex-1 lg:pl-4 flex flex-col p-0 h-[250px]">
            <h2 className="text-3xl font-sans text-gray-800 mb-4">Dịch vụ: {service.ten_dich_vu}</h2>
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-medium text-gray-700 mt-0 p-0">
                <strong>Thời gian:</strong> {service.thoi_gian}
              </p>
              <p className="text-lg font-medium text-gray-700 mb-3 p-0">
                <strong>Số tiền:</strong> {Number(service.gia).toLocaleString('vi-VN')} VND
              </p>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={handleBookService}
                className="py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
              >
                Đặt dịch vụ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for booking service */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px] shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Đặt dịch vụ</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Chọn thú cưng</label>
                <select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">Chọn thú cưng</option>
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.ten}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Ngày giờ</label>
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Ghi chú</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Nhập ghi chú (nếu có)"
                  name="notes"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={handleModalClose}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="container reviews mt-16">
        <h3 className="text-2xl font-semibold mb-4 mt-8">Bình luận</h3>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600">Chưa có bình luận nào.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="review p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <img
                    src={review.id_nguoidung?.anh_dai_dien ? `${process.env.REACT_APP_API_URL}${review.id_nguoidung?.anh_dai_dien}` : '/img/daidien.jpg'}
                    alt={review.id_nguoidung?.ten_hien_thi || 'Người dùng'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <p className="font-semibold text-gray-700">
                    {review.id_nguoidung?.ten_hien_thi || 'Người dùng'}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-gray-600">{review.binh_luan}</p>
                  <span className="text-yellow-500">
                    {'★'.repeat(review.so_sao)}{'☆'.repeat(5 - review.so_sao)}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.ngay_danh_gia).toLocaleString()}
                  </p>
                </div>

                <div className="mt-2">
                  <span className={`text-sm font-semibold ${review.trang_thai === 'Chưa đánh giá' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {review.trang_thai}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceDetail;
