import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ServiceList from './components/ServiceList';
import BookService from './components/BookService';
import Hero from './pages/Hero';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';
import UpdateUserInfo from './components/UpdateUserInfo';
import AddPetForm from './components/AddPetForm';
import ManageBookings from './components/ManageBookings';
import CT1 from './components/CT1';
import Lbook from './components/Lbook';
import PetUser from './components/PetUser';
import ContactPage from './layouts/ContactPage';
import MainLayout from './layouts/MainLayout';
import Employees from './components/Employees';
import UserManagementPage from './components/UserManagementPage';
import ManageService from './components/ManageService';
import ManageAssignments from './components/ManageAssignments';
import ReivewList from './components/ReivewList';
import StatisticsPage from './components/StatisticsPage';
import AdminLayout from './layouts/AdminLayout'; // Import AdminLayout
import RevenueBooking from './components/RevenueBooking';
import SendNotification from './components/SendNotification';
import NotificationList from './components/NotificationList';
import ServiceListBooking from './components/ServiceListBooking';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Các route không cần Sidebar nhưng cần Header */}
          <Route path="/" element={<Navigate to="/trangchu" />} />
          <Route path="/login" element={<MainLayout><LoginForm /></MainLayout>} />
          <Route path="/thucung" element={<MainLayout><AddPetForm /></MainLayout>} />
          <Route path="/lienhe" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/tk" element={<MainLayout><StatisticsPage /></MainLayout>} />
          <Route path="/service/:id" element={<MainLayout><CT1 /></MainLayout>} />
          <Route path="/petuser" element={<MainLayout><PetUser /></MainLayout>} />
          <Route path="/dichvu" element={<MainLayout><ServiceListBooking /></MainLayout>} />
          <Route
            path="/trangchu"
            element={
              <MainLayout>
                <div>
                  <Hero />
                  <ServiceList />
                </div>
              </MainLayout>
            }
          />
          <Route path="/book-service" element={<MainLayout><BookService /></MainLayout>} />
          <Route path="/sign" element={<MainLayout><RegisterForm /></MainLayout>} />
          <Route
            path="/thongtinnguoidung"
            element={
              <MainLayout>
                <UpdateUserInfo />
              </MainLayout>
            }
          />
          <Route path="/ls" element={<MainLayout><Lbook /></MainLayout>} />

          {/* Các route cần Sidebar và Header */}
          <Route
            path="/qlnhanvien"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <Employees />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qlnguoidung"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <UserManagementPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qlthongbao"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <SendNotification />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/thongbao"
            element={
              <MainLayout>
                <NotificationList />
              </MainLayout>
            }
          />
          <Route
            path="/qldichvu"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <ManageService />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qlphancong"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <ManageAssignments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qldanhgia"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <ReivewList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qldatdichvu"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <ManageBookings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qldoanhthu"
            element={
              <ProtectedRoute allowedRoles={['675029a23db47ccd373fb211']}>
                <AdminLayout>
                  <RevenueBooking />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
