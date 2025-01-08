// src/pages/Hero.tsx
import React from 'react';
import { Link } from 'react-router-dom';
const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="row flex-h container">
        <div className="hero-content">
          <h1>Chăm sóc thú cưng thông minh của bạn !</h1>
          <p>Bạn có thể đặt dịch vụ chăm sóc thú cưng của mình tại đây.</p>
          <Link to="/book-service" className="page-btn row">Đặt dịch vụ</Link>

        </div>
        <div className="hero-img row">
          <img src="/img/pet2.png" alt="Pet" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
