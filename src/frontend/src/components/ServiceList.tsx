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

  if (loading) return <p>Loading...</p>;

  return (
    <section className="service" id="service">
      <div className="container">
        <h2><span>Danh sách</span> các dịch vụ</h2>
        <div className="service-cards column">
          {services.map((service: Service) => (
            <div key={service._id} className="s-card">
              <Link to={`/service/${service._id}`}>
                <img src={`http://localhost:5000${service.hinh_anh}`} alt={service.ten_dich_vu} />
              </Link>
              <h3>{service.ten_dich_vu}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
