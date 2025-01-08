const ContactInfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">THÔNG TIN LIÊN HỆ</h1>
        
        <div className="contact-info mb-8">
          <p className="text-lg text-gray-700"><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
          <p className="text-lg text-gray-700"><strong>Số điện thoại:</strong> (028) 1234 5678</p>
          <p className="text-lg text-gray-700"><strong>Email:</strong> contact@company.com</p>
          <p className="text-lg text-gray-700"><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6, 8:00 AM - 5:00 PM</p>
        </div>

        {/* <div className="contact-social mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liên hệ qua mạng xã hội</h2>
          <ul className="space-y-2">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">LinkedIn</a></li>
          </ul>
        </div> */}

        <div className="contact-map">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vị trí của chúng tôi</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.661162437153!2d106.62966331535033!3d10.762622492257562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c8d8d4b57%3A0x6b8d5e5e9c46a3e2!2zMTIzIMSQw6FuaCBhY2ggUXXhuqFpIFh1eSBLaW5nIFh1YW5n!5e0!3m2!1svi!2s!4v1643155984730!5m2!1svi!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPage;
