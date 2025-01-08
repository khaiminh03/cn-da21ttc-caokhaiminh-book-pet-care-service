import { Controller, Get,Post,Body,Put, Delete, Param, UseInterceptors, UploadedFile, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto'; 
import { storage } from '../upload/storage'
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Lấy thông tin người dùng theo ID
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

   // Cập nhật thông tin người dùng
   @Post(':id/update')
   async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
     return this.userService.updateUser(id, updateUserDto);
   }
   @Put('update/:id')
   async updateUsers(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
     return this.userService.update(id, updateUserDto);
   }
   @Post(':id/update')
  async updateUserInfo(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Cập nhật thông tin người dùng (có ảnh đại diện)
  // Lấy thông tin người dùng theo ID
  @Put(':id')
  @UseInterceptors(FileInterceptor('anh_dai_dien', { storage }))
  async updateUserWithAvatar(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.anh_dai_dien = `/img/${file.filename}`;
    }
    return this.userService.update(id, updateUserDto);
  }

  // API để cập nhật mật khẩu
  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('mat_khau') mat_khau: string,
  ) {
    return this.userService.updatePassword(id, mat_khau);
  }
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // Trả về thông tin người dùng, bao gồm ảnh đại diện
  }
  // Lấy tất cả người dùng
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }
   // API để xóa người dùng
   @Delete(':id')
   async deleteUser(@Param('id') id: string) {
     const user = await this.userService.deleteUser(id);
     if (!user) {
       throw new NotFoundException('User not found');
     }
     return { message: 'User deleted successfully' };
   }
  
}
