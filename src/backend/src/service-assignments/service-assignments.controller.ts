// src/service-assignment/service-assignment.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ServiceAssignmentService } from './service-assignments.service';
import { ServiceAssignment } from './schemas/service-assignments.schema';
import { CreateServiceAssignmentDto } from './dto/create-service-assignment.dto';

@Controller('serviceassignments')
export class ServiceAssignmentController {
  constructor(private readonly serviceAssignmentService: ServiceAssignmentService) {}

  // Phương thức tạo phân công dịch vụ
  @Post()
  async create(@Body() createServiceAssignmentDto: CreateServiceAssignmentDto): Promise<ServiceAssignment> {
    return this.serviceAssignmentService.create(createServiceAssignmentDto);
  }
 // Lấy tất cả phân công dịch vụ
 @Get()
 async getAllAssignments(): Promise<ServiceAssignment[]> {
   return this.serviceAssignmentService.getAllAssignments();
 }

 // Lấy phân công dịch vụ theo ID
 @Get(':id')
 async getAssignmentById(@Param('id') id: string): Promise<ServiceAssignment> {
   return this.serviceAssignmentService.getAssignmentById(id);
 }

 // Cập nhật phân công dịch vụ
 @Put(':id')
 async updateAssignment(@Param('id') id: string, @Body() updateData: Partial<ServiceAssignment>): Promise<ServiceAssignment> {
   return this.serviceAssignmentService.updateAssignment(id, updateData);
 }

 // Xóa phân công dịch vụ
 @Delete(':id')
 async deleteAssignment(@Param('id') id: string): Promise<void> {
   return this.serviceAssignmentService.deleteAssignment(id);
 }
}
