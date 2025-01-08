// src/services/services.controller.ts
import { Controller, Get, Post, Body, Put, Delete, Param, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ServicesService } from './service.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './schemas/service.schema';  // Đảm bảo import đúng Service schema
import { storage, fileFilter } from '../upload/storage';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Lấy tất cả dịch vụ
  @Get()
  async findAll() {
    try {
      return await this.servicesService.findAll(); // Trả về danh sách dịch vụ từ MongoDB
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  // Lấy dịch vụ theo ID
  @Get(':id') // :id là parameter trong URL
  async findOne(@Param('id') id: string) {
    try {
      const service = await this.servicesService.findById(id);
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      return service; // Trả về dịch vụ tìm được
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      throw error; // Ném lỗi ra ngoài nếu có lỗi
    }
  }

  // Cập nhật dịch vụ cơ bản
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto);
  }

  // Cập nhật dịch vụ với ảnh
  @Put(':id/with-image')
  @UseInterceptors(FileInterceptor('hinh_anh', { storage }))
  async updateServiceWithImage(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateServiceDto.hinh_anh = `/img/${file.filename}`; // Cập nhật đường dẫn ảnh vào DTO
    }
    return this.servicesService.update(id, updateServiceDto); // Cập nhật dịch vụ
  }

  // Xóa dịch vụ
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.servicesService.remove(id);
  }

  // Xử lý upload ảnh
  @Post('upload')
  @UseInterceptors(FileInterceptor('hinh_anh', { storage, fileFilter }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return { filePath: `/img/${file.filename}` }; // Trả về đường dẫn file đã upload
    }
    throw new NotFoundException('File upload failed');
  }
  @Post('create')
    @UseInterceptors(FileInterceptor('hinh_anh', { storage })) // Sử dụng multer để upload ảnh
    async create(@Body() CreateServiceDto: CreateServiceDto, @UploadedFile() file: Express.Multer.File): Promise<Service> {
      // Lưu đường dẫn ảnh vào trong DTO
      if (file) {
        CreateServiceDto.hinh_anh = `/img/${file.filename}`; // Lưu đường dẫn ảnh vào cơ sở dữ liệu
      }
      
      // Tạo dịch vụ mới
      return this.servicesService.create(CreateServiceDto);
    }
}
