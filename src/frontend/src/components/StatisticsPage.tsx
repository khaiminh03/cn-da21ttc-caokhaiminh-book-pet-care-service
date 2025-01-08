import React, { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho thống kê
interface BookingStatus {
    _id: string;
    count: number;
}

const StatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<BookingStatus[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch data từ API
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch("http://localhost:5000/book-service/booking-status-statistics");
                if (!response.ok) {
                    throw new Error(`API trả về lỗi: ${response.status}`);
                }

                const data: BookingStatus[] = await response.json();

                // Kiểm tra dữ liệu trả về
                if (Array.isArray(data)) {
                    setStatistics(data);
                } else {
                    throw new Error("Dữ liệu không phải là một mảng.");
                }
            } catch (error: any) {
                setError(error.message);
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, []);

    // Hiển thị khi có lỗi hoặc dữ liệu chưa được tải
    if (error) {
        return <div className="text-center text-red-500">Có lỗi khi tải dữ liệu: {error}</div>;
    }

    if (!statistics) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    // Kiểm tra khi không có dữ liệu
    if (statistics.length === 0) {
        return <div className="text-center">Không có dữ liệu thống kê</div>;
    }

    // Hiển thị thống kê
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Thống kê trạng thái đặt dịch vụ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statistics.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white border rounded-lg shadow-lg p-6 flex items-center justify-between"
                    >
                        <div className="text-lg font-semibold">
                            {item._id === "Hoàn thành" ? "Hoàn thành" : "Đã hủy"}
                        </div>
                        <div className="text-2xl font-bold">{item.count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatisticsPage;
