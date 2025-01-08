import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService, BookServiceSchema } from './schemas/book-service.schema';
import { BookServiceService } from '../book-service/service-booking.service';
import { BookServiceController } from '../book-service/service-booking.controller';
import { EmployeeModule } from '../employees/employee.module';
import { ServiceAssignmentModule } from '../service-assignments/service-assignments.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookService.name, schema: BookServiceSchema }]),
    EmployeeModule,
    ServiceAssignmentModule,
  ],
  controllers: [BookServiceController],
  providers: [BookServiceService],
})
export class BookServiceModule {}
