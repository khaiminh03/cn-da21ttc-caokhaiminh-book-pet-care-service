// src/components/ServiceList.tsx
import React, { useEffect, useState } from 'react';
import { fetchServices } from '../services/api';
import { Service } from '../types';
import { Link } from 'react-router-dom';

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
            } catch (error) {
                console.error('Failed to load services:', error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    if (loading) return <p className="text-center text-xl">Loading...</p>;

    return (
        <section className="service py-16 bg-gray-50 " id="service">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-indigo-600 mb-12">
                    <p className=' text-4xl font-bold font-serif uppercase'>Danh sách các dịch vụ hiện có</p>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {services.map((service: Service) => (
                        <Link to={`/service/${service._id}`} key={service._id} className="group">
                            <div className="s-card bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
                                <img
                                    src={`http://localhost:5000${service.hinh_anh}`}
                                    alt={service.ten_dich_vu}
                                    className="w-full h-48 object-cover rounded-md mb-4 mx-auto group-hover:opacity-80 transition-opacity"
                                />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {service.ten_dich_vu}
                                </h3>
                                <p className="text-gray-600">Thời gian: {service.thoi_gian}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceList;
