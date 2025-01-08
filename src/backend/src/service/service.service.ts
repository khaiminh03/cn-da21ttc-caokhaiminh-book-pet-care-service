// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) {}

  async findAll(): Promise<Service[]> {
    try {
      return await this.serviceModel.find().exec();  // Trả về danh sách dịch vụ
    } catch (error) {
      console.error('Error in service fetch:', error);
      throw error;
    }
  }
  // Phương thức lấy dịch vụ theo ID
  async findById(id: string): Promise<Service | null> {
    try {
      return await this.serviceModel.findById(id).exec(); // Tìm dịch vụ theo ID
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error; // Ném lỗi ra ngoài nếu có lỗi
    }
  }
 // Tạo mới dịch vụ
 // Phương thức tạo dịch vụ mới
 async create(createServiceDto: CreateServiceDto): Promise<Service> {
  try {
    const createdService = new this.serviceModel(createServiceDto);
    return await createdService.save(); // Lưu dịch vụ vào MongoDB
  } catch (error) {
    console.error('Error saving service:', error); // Log lỗi khi lưu
    throw error;
  }
}


  // Lấy thông tin dịch vụ theo ID
  async findOne(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  // Cập nhật dịch vụ
  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceModel.findByIdAndUpdate(
      id,
      updateServiceDto,
      { new: true },
    ).exec();
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  // Xóa dịch vụ
  async remove(id: string): Promise<void> {
    const result = await this.serviceModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }
  async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  
    // Cập nhật thông tin dịch vụ
    Object.assign(service, updateServiceDto);
    return service.save();
  }
  
  
}
