// src/pets/pets.controller.ts (hoặc nơi bạn xử lý route cho pets)
import { Controller,Get, Param, Put,Delete, Post, Body,NotFoundException,UseInterceptors,UploadedFile} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './schemas/pet.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mongoose from 'mongoose';
import { storage } from '../upload/storage'
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  // Route để lấy thú cưng của người dùng
  // @Post('create')
  // async create(@Body() createPetDto: CreatePetDto) {
  //   return this.petsService.create(createPetDto);
  // }
  @Post('create')
  @UseInterceptors(FileInterceptor('hinh_anh', { storage })) // Sử dụng multer để upload ảnh
  async create(@Body() createPetDto: CreatePetDto, @UploadedFile() file: Express.Multer.File): Promise<Pet> {
    // Lưu đường dẫn ảnh vào trong DTO
    if (file) {
      createPetDto.hinh_anh = `/img/${file.filename}`; // Lưu đường dẫn ảnh vào cơ sở dữ liệu
    }
    
    // Tạo thú cưng mới
    return this.petsService.create(createPetDto);
  }
  @Put(':id')
@UseInterceptors(FileInterceptor('hinh_anh', { storage })) // Sử dụng FileInterceptor để xử lý ảnh
async update(
  @Param('id') id: string,
  @Body() updatePetDto: UpdatePetDto,
  @UploadedFile() file?: Express.Multer.File, // Bắt file nếu có
): Promise<Pet> {
  if (file) {
    // Nếu có file upload, lưu đường dẫn vào DTO
    updatePetDto.hinh_anh = `/img/${file.filename}`;
  }

  // Gọi service để cập nhật
  return this.petsService.update(id, updatePetDto);
}

    // Route để cập nhật thú cưng
  @Get('user/:userId')
  async getPetsByUser(@Param('userId') userId: string) {
    // Chuyển userId từ string sang ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Chuyển ObjectId thành string nếu cần
    const userIdString = objectId.toString();

    // Truyền userIdString vào service
    return this.petsService.getPetsByUser(userIdString);
  }
  @Get()
  async getAllPets() {
    return this.petsService.findAll(); // Giả sử findAll() trả về danh sách thú cưng
  }
  @Delete(':id')
  async deletePet(@Param('id') id: string): Promise<{ message: string }> {
    const pet = await this.petsService.findOne(id);
    if (!pet) {
      throw new NotFoundException('Thú cưng không tồn tại');
    }
    await this.petsService.remove(id);
    return { message: 'Thú cưng đã được xóa thành công' };
  }

}
