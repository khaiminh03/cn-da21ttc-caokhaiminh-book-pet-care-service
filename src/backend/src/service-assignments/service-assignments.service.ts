import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceAssignment } from './schemas/service-assignments.schema'; // Import schema phân công dịch vụ
import { CreateServiceAssignmentDto } from './dto/create-service-assignment.dto';  // Kiểm tra đường dẫn này
@Injectable()
export class ServiceAssignmentService {
  constructor(
    @InjectModel(ServiceAssignment.name) private readonly serviceAssignmentModel: Model<ServiceAssignment>,
  ) {}

  async create(createServiceAssignmentDto: CreateServiceAssignmentDto): Promise<ServiceAssignment> {
    const createdServiceAssignment = new this.serviceAssignmentModel(createServiceAssignmentDto);
    return createdServiceAssignment.save();  // Lưu phân công dịch vụ vào MongoDB
  }
  async createServiceAssignment(data: Partial<ServiceAssignment>): Promise<ServiceAssignment> {
    const serviceAssignment = new this.serviceAssignmentModel(data);
    return serviceAssignment.save();  // Lưu phân công dịch vụ vào cơ sở dữ liệu
  }
 
  // Lấy tất cả phân công dịch vụ
  async getAllAssignments() {
    const assignments = await this.serviceAssignmentModel
      .find()
      .populate('id_nhanvien', 'ten')        // Populate tên nhân viên
      .populate('id_dichvu', 'ten_dich_vu')  // Populate tên dịch vụ
      .populate('id_nguoidung', 'ten_dang_nhap') // Populate tên người dùng
      .exec();
  
    return assignments;
  }
  

  // Lấy phân công dịch vụ theo ID
  async getAssignmentById(id: string): Promise<ServiceAssignment> {
    return this.serviceAssignmentModel.findById(id).exec();
  }

  // Cập nhật phân công dịch vụ
  async updateAssignment(id: string, updateData: Partial<ServiceAssignment>): Promise<ServiceAssignment> {
    return this.serviceAssignmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Xóa phân công dịch vụ
  async deleteAssignment(id: string): Promise<void> {
    await this.serviceAssignmentModel.findByIdAndDelete(id).exec();
  }
}
