import { Controller, Post, Body, Param, Get, Delete, Patch,NotFoundException,InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { BookServiceService } from '../book-service/service-booking.service';
import { BookService } from './schemas/book-service.schema';
import { Types } from 'mongoose'; 

@Controller('book-service')
export class BookServiceController {
  constructor(private readonly bookServiceService: BookServiceService) {}

  @Post()
  async createBooking(@Body() bookingData: Partial<BookService>) {
    try {
      const newBooking = await this.bookServiceService.createBooking(bookingData);
      return {
        success: true,
        data: newBooking,
      };
    } catch (error) {
      console.error('Lỗi khi tạo booking:', error);
      return {
        success: false,
        message: 'Không thể tạo booking',
      };
    }
  }
  
   @Get()
   async getAllBookings() {
  return this.bookServiceService.getAllBookings();
   }

  // API cập nhật trạng thái dịch vụ
  @Patch(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() body: { trang_thai: string }, // Trạng thái mới
  ) {
    const { trang_thai } = body;
    return this.bookServiceService.updateStatus(id, trang_thai);
  }
  // lịch sử đặt
  // API để lấy lịch sử đặt dịch vụ của người dùng
  @Get('history/:userId')
async getBookingHistory(@Param('userId') userId: string) {
  try {
    // Kiểm tra nếu userId là ObjectId hợp lệ
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    const userObjectId = new Types.ObjectId(userId); // Sử dụng Types.ObjectId

    // Gọi service để lấy lịch sử đặt dịch vụ của người dùng
    const bookingHistory = await this.bookServiceService.getBookingHistory(userObjectId);

    if (!bookingHistory || bookingHistory.length === 0) {
      throw new NotFoundException('Không tìm thấy lịch sử đặt dịch vụ');
    }

    return {
      success: true,
      data: bookingHistory,
    };
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đặt dịch vụ:', error.message);
    throw error;
  }
}

  // hủy dịch vụ
   // Route để hủy dịch vụ
   @Patch('cancel/:bookingId')
async cancelBooking(
  @Param('bookingId') bookingId: string,
): Promise<{ message: string; booking: BookService }> {
  try {
    // Kiểm tra bookingId có hợp lệ không
    const booking = await this.bookServiceService.findBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Kiểm tra trạng thái của booking
    if (booking.trang_thai !== 'Chờ xác nhận') {
      throw new Error('Chỉ có thể hủy khi trạng thái là "Chờ xác nhận"');
    }

    // Thực hiện hủy booking
    const canceledBooking = await this.bookServiceService.cancelBooking(bookingId);

    return {
      message: 'Booking has been successfully canceled',
      booking: canceledBooking,
    };
  } catch (error) {
    throw new Error(error.message || 'An error occurred while canceling the booking');
  }
}

   
   @Get(':bookingId')
  async getBooking(@Param('bookingId') bookingId: string) {
    return this.bookServiceService.getBookingWithEmployee(bookingId);
  }
  // xóa booking
  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    await this.bookServiceService.deleteBooking(id);
    return { message: 'Dịch vụ đã được xóa thành công!' };
  }
   
    
  
}
