// src/service-assignment/service-assignment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceAssignment, ServiceAssignmentSchema } from './schemas/service-assignments.schema';
import { ServiceAssignmentController } from './service-assignments.controller';
import { ServiceAssignmentService } from './service-assignments.service';
import { EmployeeModule } from '../employees/employee.module'; // Import module quản lý nhân viên
import { ServicesModule } from '../service/services.module'; // Import module quản lý dịch vụ

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceAssignment.name, schema: ServiceAssignmentSchema },
    ]),
    EmployeeModule,  // Để lấy thông tin nhân viên
    ServicesModule,   // Để lấy thông tin dịch vụ
  ],
  controllers: [ServiceAssignmentController],
  providers: [ServiceAssignmentService],
  exports: [ServiceAssignmentService],
})
export class ServiceAssignmentModule {}
