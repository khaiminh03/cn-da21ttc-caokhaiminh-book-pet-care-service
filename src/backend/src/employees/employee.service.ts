// src/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schemas/employee.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<Employee>) {}

  // Lấy tất cả nhân viên
  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeModel.find().exec(); // Truy vấn tất cả nhân viên từ collection 'employee'
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  // Lấy nhân viên theo ID
  async findById(id: string): Promise<Employee | null> {
    try {
      return await this.employeeModel.findById(id).exec(); // Truy vấn nhân viên theo ID
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  }

  // Tạo nhân viên mới
  async create(employeeData: any): Promise<Employee> {
    const newEmployee = new this.employeeModel(employeeData);
    return newEmployee.save();
  }

  // Cập nhật thông tin nhân viên
  async update(id: string, updateData: any): Promise<Employee> {
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return updatedEmployee;
  }

  // Xóa nhân viên
  async remove(id: string): Promise<void> {
    const result = await this.employeeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  }
  // Lấy tất cả nhân viên có trạng thái active
  async findAllActiveEmployees(): Promise<Employee[]> {
    return this.employeeModel.find({ trang_thai: 'rảnh' }).exec();
  }
  // cập nhật trạng thái active
  async updateEmployeeStatus(employeeId: string, status: string): Promise<Employee> {
    return this.employeeModel.findByIdAndUpdate(
      employeeId,
      { trang_thai: status },
      { new: true },
    );
  }
  async updateStatus(id: string, status: { trang_thai: string }) {
    return this.employeeModel.findByIdAndUpdate(id, { trang_thai: status.trang_thai }, { new: true });
  }
  
}
