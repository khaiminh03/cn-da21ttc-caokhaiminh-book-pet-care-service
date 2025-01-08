import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async createRole(roleData: { ten_vai_tro: string; mo_ta: string }) {
    const newRole = new this.roleModel(roleData);
    return newRole.save();
  }

  async findAllRoles() {
    return this.roleModel.find().exec();
  }

  async findRoleByName(roleName: string) {
    return this.roleModel.findOne({ ten_vai_tro: roleName }).exec();
  }
}
