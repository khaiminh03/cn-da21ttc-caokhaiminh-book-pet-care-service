// src/pets/pets.service.ts
import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { Pet } from './schemas/pet.schema'; // Giả sử bạn có schema Pet
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<Pet>,
  ) {}

 // Phương thức tạo thú cưng mới
 async create(createPetDto: CreatePetDto): Promise<Pet> {
  const createdPet = new this.petModel({
    ...createPetDto,
    id_nguoidung: new Types.ObjectId(createPetDto.id_nguoidung), // Chuyển id_nguoidung thành ObjectId
  });
  return await createdPet.save(); // Lưu thú cưng vào MongoDB
}

  // Tìm thú cưng của người dùng theo userId
  async findByUser(userId: string): Promise<Pet[]> {
    return this.petModel.find({ id_nguoidung: userId }).exec();
  }
   // Cập nhật thú cưng
   async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      throw new NotFoundException('Thú cưng không tồn tại');
    }
  
    // Nếu có hình ảnh mới, xóa hình ảnh cũ
    if (updatePetDto.hinh_anh && pet.hinh_anh) {
      const oldImagePath = `./public${pet.hinh_anh}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
      }
    }
  
    // Cập nhật các trường
    Object.assign(pet, updatePetDto);
    return pet.save(); // Lưu thay đổi vào cơ sở dữ liệu
  }
  
   // Lấy thú cưng của người dùng
   async getPetsByUser(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId); // Chuyển đổi từ string sang ObjectId
    return await this.petModel.find({ id_nguoidung: objectId });
  }
  async findAll() {
    return this.petModel.find().exec();
  }
  async findOne(id: string): Promise<Pet | null> {
    return this.petModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.petModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Thú cưng không tồn tại');
    }
  }

}
