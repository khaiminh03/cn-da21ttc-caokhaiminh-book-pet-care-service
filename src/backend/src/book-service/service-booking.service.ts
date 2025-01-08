import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { BookService } from './schemas/book-service.schema';
import { EmployeeService } from '../employees/employee.service';
import { ServiceAssignmentService } from '../service-assignments/service-assignments.service';
import { ObjectId } from 'mongodb'; 

@Injectable()
export class BookServiceService {
  constructor(
    @InjectModel(BookService.name) private readonly bookServiceModel: Model<BookService>,
    private readonly employeeService: EmployeeService, // Inject EmployeeService
    private readonly serviceAssignmentService: ServiceAssignmentService, // Inject ServiceAssignmentService
  ) {}

  async createBooking(data: Partial<BookService>): Promise<BookService> {
    // Chuyển đổi các trường thành ObjectId nếu chúng là chuỗi
    if (typeof data.id_nguoidung === 'string') {
      data.id_nguoidung = new Types.ObjectId(data.id_nguoidung); // Chuyển đổi chuỗi thành ObjectId
    }
    if (typeof data.id_dichvu === 'string') {
      data.id_dichvu = new Types.ObjectId(data.id_dichvu); // Chuyển đổi chuỗi thành ObjectId
    }
    if (typeof data.id_thucung === 'string') {
      data.id_thucung = new Types.ObjectId(data.id_thucung); // Chuyển đổi chuỗi thành ObjectId
    }
  
    // 1. Lưu thông tin booking
    const booking = new this.bookServiceModel(data);
    const newBooking = await booking.save();
  
    // 2. Lấy danh sách nhân viên rảnh
    const employees = await this.employeeService.findAllActiveEmployees();
  
    if (employees.length === 0) {
      throw new Error('No active employees available');
    }
  
    // 3. Chọn ngẫu nhiên một nhân viên
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
  
    // 4. Cập nhật trạng thái nhân viên thành "đang làm việc"
    await this.employeeService.updateEmployeeStatus(randomEmployee._id.toString(), 'đang làm việc');
  
    // 5. Lưu phân công dịch vụ
    const serviceAssignmentData = {
      id_nhanvien: randomEmployee._id as Types.ObjectId,  // Đảm bảo kiểu là Types.ObjectId
      id_dichvu: newBooking.id_dichvu as Types.ObjectId,  // Đảm bảo kiểu là Types.ObjectId
      id_nguoidung: newBooking.id_nguoidung as Types.ObjectId,  // Đảm bảo kiểu là Types.ObjectId
      ngay_gio_phan_cong: newBooking.ngay_gio,
    };
  
    await this.serviceAssignmentService.createServiceAssignment(serviceAssignmentData);
  
    // 6. Cập nhật lại booking với id_nhanvien
    newBooking.id_nhanvien = randomEmployee._id as Types.ObjectId;  // Lưu id_nhanvien vào bảng BookService
    await newBooking.save();
  
    return newBooking;
  }
   
  // Lấy tất cả các dịch vụ đã đặt
  async getAllBookings(): Promise<BookService[]> {
    return this.bookServiceModel.find()
      .populate('id_nguoidung')  // Thông tin người dùng
      .populate('id_dichvu')     // Thông tin dịch vụ
      .populate('id_thucung')    // Thông tin thú cưng
      .populate('id_nhanvien')   // Thông tin nhân viên
      .exec();
  }

// Cập nhật trạng thái dịch vụ
async updateStatus(id: string, newStatus: string): Promise<BookService> {
  // 1. Tìm booking cần cập nhật
  const booking = await this.bookServiceModel.findById(id);
  if (!booking) {
    throw new Error('Không tìm thấy dịch vụ đặt');
  }

  // 2. Cập nhật trạng thái booking
  booking.trang_thai = newStatus;
  await booking.save();

  // 3. Nếu trạng thái là "Hoàn thành", cập nhật trạng thái nhân viên
  if (newStatus === 'Hoàn thành' && booking.id_nhanvien) {
    await this.employeeService.updateEmployeeStatus(
      booking.id_nhanvien.toString(),
      'rảnh', // Chuyển trạng thái nhân viên thành "active"
    );
  }

  // 4. Nếu trạng thái là "Đã hủy", cập nhật trạng thái nhân viên thành "active"
  if (newStatus === 'Đã hủy' && booking.id_nhanvien) {
    // Có thể bạn muốn cập nhật trạng thái nhân viên thành "đang làm việc" thay vì "active"
    await this.employeeService.updateEmployeeStatus(
      booking.id_nhanvien.toString(),
      'rảnh', // Hoặc trạng thái khác tùy theo quy trình
    );
  }

  return booking;
}

 // Lấy lịch sử đặt dịch vụ của người dùng
 async getBookingHistory(userId: Types.ObjectId) {
  const bookings = await this.bookServiceModel.find({ id_nguoidung: userId })
    .populate('id_dichvu')  // Populate thông tin dịch vụ từ bảng Service
    .populate('id_nhanvien') // Populate thông tin nhân viên
    .populate('id_thucung')  // Populate thông tin thú cưng
    .exec();

  return bookings.map(booking => ({
    _id: booking._id,
    id_dichvu: booking.id_dichvu,
    ngay_gio: booking.ngay_gio,
    trang_thai: booking.trang_thai,
    ghi_chu: booking.ghi_chu,
    ten_thu_cung: booking.id_thucung ? (booking.id_thucung as any).ten : 'Không có thú cưng',
    loai_thu_cung: booking.id_thucung ? (booking.id_thucung as any).loai : 'Không có thông tin loài',
    tuoi_thu_cung: booking.id_thucung ? (booking.id_thucung as any).tuoi : 'Không có thông tin tuổi',
    ten_nhanvien: booking.id_nhanvien ? (booking.id_nhanvien as any).ten : 'Không có nhân viên',
    id_nhanvien: booking.id_nhanvien ? booking.id_nhanvien._id : null,
  }));
}

// Phương thức hủy dịch vụ
// async cancelBooking(bookingId: string, userId: Types.ObjectId): Promise<BookService> {
//   const booking = await this.bookServiceModel.findOne({ _id: bookingId, id_nguoidung: userId }).exec();

//   if (!booking) {
//     throw new NotFoundException('Không tìm thấy dịch vụ để hủy.');
//   }

//   console.log('Trạng thái dịch vụ trước khi hủy:', booking.trang_thai);

//   if (booking.trang_thai === 'Đã hủy') {
//     throw new BadRequestException('Dịch vụ này đã bị hủy trước đó.');
//   }

//   // Cập nhật trạng thái dịch vụ thành "Đã hủy"
//   booking.trang_thai = 'Đã hủy';
//   await booking.save();

//   console.log('Trạng thái dịch vụ sau khi hủy:', booking.trang_thai);

//   return booking;
// }
// Tìm kiếm booking theo ID
async findBookingById(bookingId: string): Promise<BookService | null> {
  const booking = await this.bookServiceModel.findById(bookingId).exec();
  if (!booking) {
    throw new NotFoundException('Booking not found');
  }
  return booking;
}

// Hủy booking
async cancelBooking(bookingId: string): Promise<BookService> {
  const booking = await this.bookServiceModel.findById(bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Kiểm tra trạng thái của booking
  if (booking.trang_thai !== 'Chờ xác nhận') {
    throw new Error('Chỉ có thể hủy khi trạng thái là "Chờ xác nhận"');
  }

  // Thực hiện hủy booking
  booking.trang_thai = 'Đã hủy';  // Cập nhật trạng thái của booking
  return booking.save();  // Lưu lại booking đã được hủy
}


// Phương thức lấy thông tin booking và nhân viên
async getBookingWithEmployee(bookingId: string): Promise<BookService> {
  return this.bookServiceModel
    .findById(bookingId)
    .populate('id_nhanvien')  // Populate thông tin nhân viên
    .exec();
}

async deleteBooking(bookingId: string): Promise<void> {
  const booking = await this.bookServiceModel.findById(bookingId);
  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  // Xóa dịch vụ đặt từ cơ sở dữ liệu
  await this.bookServiceModel.deleteOne({ _id: bookingId });

  // Nếu cần, bạn có thể cập nhật trạng thái nhân viên hoặc các bản ghi khác ở đây
  // Ví dụ: Cập nhật trạng thái nhân viên sau khi xóa dịch vụ
  if (booking.id_nhanvien) {
    // Giả sử bạn có một EmployeeService để cập nhật trạng thái nhân viên
    // await this.employeeService.updateEmployeeStatus(booking.id_nhanvien, 'inactive');
  }
}
// thống kê


}
  
  
