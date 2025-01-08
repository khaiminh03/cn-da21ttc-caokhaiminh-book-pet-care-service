import { Controller, Get, Post, Body, Param, Put, NotFoundException, Delete, HttpCode, HttpStatus, } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../notifications/schemas/notification.schema';
import { Types } from 'mongoose';

@Controller('notice')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Tạo mới thông báo
  @Post()
  async createNotification(
    @Body() createNotificationDto: { id_nguoidung: string, noi_dung: string, loai_thong_bao: string },
  ): Promise<Notification> {
    // Chuyển đổi id_nguoidung từ string thành ObjectId
    const id_nguoidung = new Types.ObjectId(createNotificationDto.id_nguoidung);

    return this.notificationsService.createNotification(
      id_nguoidung, // Truyền ObjectId thay vì string
      createNotificationDto.noi_dung,
      createNotificationDto.loai_thong_bao,
    );
  }

  // Lấy tất cả thông báo của người dùng
  @Get(':id')
  async getNotifications(@Param('id') id_nguoidung: string): Promise<Notification[]> {
    return this.notificationsService.getNotificationsByUser(id_nguoidung);
  }

  // Đánh dấu thông báo là đã đọc
  @Put(':id/mark-as-read')
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  // API lấy thông báo của người dùng
  @Get('user/:userId')
async getNotificationsByUserId(@Param('userId') userId: string) {
  console.log('Fetching notifications for userId:', userId); // Debug log
  try {
    const notifications = await this.notificationsService.findByUserId(userId);
    console.log('Notifications found:', notifications); // Debug log
    return notifications;
  } catch (err) {
    console.error('Error fetching notifications:', err); // Debug log
    throw new Error('Không thể lấy thông báo');
  }
}
// Cập nhật trạng thái thông báo
@Put(':id')
async updateNotificationStatus(
  @Param('id') id: string,
  @Body() updateStatusDto: { trang_thai: boolean },
): Promise<Notification> {
  return this.notificationsService.updateStatus(id, updateStatusDto.trang_thai);
}
// Lấy tất cả thông báo
@Get()
async getAllNotifications(): Promise<Notification[]> {
  return this.notificationsService.getAllNotifications();
}
@Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Param('id') id: string) {
    const result = await this.notificationsService.deleteNotification(id);
    if (!result) {
      throw new NotFoundException(`Không tìm thấy thông báo với ID: ${id}`);
    }
    return { message: 'Thông báo đã được xóa thành công' };
  }
 
}
