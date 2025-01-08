// src/employee/employee.controller.ts
import { Controller, Get, Post,Patch, Body, Put, Delete, Param, NotFoundException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './schemas/employee.schema';  // Đảm bảo import đúng schema

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Lấy tất cả nhân viên
  @Get()
  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeService.findAll(); // Gọi service để lấy tất cả nhân viên
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  // Lấy nhân viên theo ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Employee> {
    const employee = await this.employeeService.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // Tạo nhân viên mới
  @Post()
  async create(@Body() employeeData: any): Promise<Employee> {
    return await this.employeeService.create(employeeData);
  }

  // Cập nhật nhân viên
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<Employee> {
    return await this.employeeService.update(id, updateData);
  }

  // Xóa nhân viên
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.employeeService.remove(id);
  }
  @Patch(':id/status')
  async updateEmployeeStatus(@Param('id') id: string, @Body() status: { trang_thai: string }) {
    // Gọi service để cập nhật trạng thái
    return this.employeeService.updateStatus(id, status);
  }
}
