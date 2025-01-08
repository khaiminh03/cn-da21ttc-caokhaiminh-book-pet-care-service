import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    anh_dai_dien: string;
    ten_hien_thi: string;
}

interface Service {
    _id: string;
    ten_dich_vu: string;
}

interface Review {
    _id: string;
    id_nguoidung: User;
    id_dichvu: string;
    so_sao: number;
    binh_luan: string;
    ngay_danh_gia: string;
    trang_thai: string;
    id_booking: string;
    ten_dich_vu?: string;  // Thêm trường tên dịch vụ
}

const ReviewsList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [services, setServices] = useState<{ [key: string]: string }>({}); // Map dịch vụ theo id
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Lấy danh sách đánh giá
        axios.get('http://localhost:5000/reviews')
            .then((response) => {
                setReviews(response.data);
                setLoading(false);
            })
            .catch((_err: any) => {
                setError('Không thể tải danh sách đánh giá');
                setLoading(false);
            });

        // Lấy danh sách dịch vụ
        axios.get('http://localhost:5000/services')
            .then((response) => {
                const servicesMap: { [key: string]: string } = {};
                response.data.forEach((service: Service) => {
                    servicesMap[service._id] = service.ten_dich_vu;
                });
                setServices(servicesMap);
            })
            .catch((_err: any) => {
                setError('Không thể tải danh sách dịch vụ');
                setLoading(false);
            });
    }, []);

    const handleDeleteReview = (reviewId: string) => {
        axios.delete(`http://localhost:5000/reviews/${reviewId}`)
            .then(() => {
                setReviews(reviews.filter((review) => review._id !== reviewId)); // Cập nhật lại danh sách sau khi xóa
            })
            .catch((_err: any) => {
                setError('Không thể xóa đánh giá');
            });
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold font-serif mb-6 text-gray-800">Quản lý đánh giá dịch vụ</h1>
            <div className="space-y-4">
                {reviews.map((review) => {
                    const userName = review.id_nguoidung?.ten_hien_thi || 'Người dùng';
                    const serviceName = services[review.id_dichvu] || 'Dịch vụ không xác định'; // Lấy tên dịch vụ từ map
                    const uniqueKey = `${review.id_booking}-${review.id_dichvu}-${userName}-${review.ngay_danh_gia}`;

                    return (
                        <div key={uniqueKey} className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-14 h-14 rounded-full border-2 border-gray-300"
                                        src={`http://localhost:5000${review.id_nguoidung?.anh_dai_dien || '/img/daidien.jpg'}`}
                                        alt="User Avatar"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{userName}</p>
                                    <p className="text-sm text-gray-500">{new Date(review.ngay_danh_gia).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-yellow-500">
                                    {'★'.repeat(review.so_sao)}{'☆'.repeat(5 - review.so_sao)}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-2">{review.binh_luan}</p>
                            <div className="mt-2">
                                <p className="text-sm font-semibold text-gray-800">Tên dịch vụ: {serviceName}</p>
                                <span className={`text-sm font-semibold ${review.trang_thai === 'Chưa đánh giá' ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {review.trang_thai}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewsList;
