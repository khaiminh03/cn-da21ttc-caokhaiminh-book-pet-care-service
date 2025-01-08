import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
  ) {}

  // Tạo mới thông báo
  async createNotification(
    id_nguoidung: Types.ObjectId,
    noi_dung: string,
    loai_thong_bao: string,
  ): Promise<Notification> {
    const newNotification = new this.notificationModel({
      id_nguoidung,
      noi_dung,
      loai_thong_bao,
      trang_thai: false, // Mặc định trạng thái là chưa đọc
      ngay_gui: new Date(),
    });
    return newNotification.save();
  }

  // Lấy thông báo của người dùng
  async getNotificationsByUser(id_nguoidung: string): Promise<Notification[]> {
    return this.notificationModel.find({ id_nguoidung });
  }

  // Đánh dấu một thông báo là đã đọc
  async markAsRead(id: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(id, { trang_thai: true }, { new: true });
  }

   // Cập nhật trạng thái thông báo
   async updateStatus(id: string, trang_thai: boolean): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      id,
      { trang_thai },
      { new: true }, // Trả về bản ghi đã được cập nhật
    );
  }

  // Lấy thông báo của người dùng theo ID
  async findByUserId(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId); // Chuyển userId thành ObjectId
    const notifications = await this.notificationModel.find({ id_nguoidung: objectId }).exec();
    console.log('Notifications:', notifications); // Debug log
    return notifications;
  }
  // Hàm lấy tất cả thông báo
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  // Xóa thông báo theo ID
  async deleteNotification(id: string): Promise<{ message: string }> {
    const result = await this.notificationModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Không tìm thấy thông báo với ID: ${id}`);
    }
    return { message: 'Thông báo đã được xóa thành công' };
  }
  
}
