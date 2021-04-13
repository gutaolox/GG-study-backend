import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password + salt, salt);
    const createdUser = new this.userModel(createUserDto);
    createdUser._id = Types.ObjectId();
    createdUser.salt = salt;
    createdUser.password = hash;
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  async remove(id: string): Promise<any> {
    this.userModel.remove({ _id: id });
  }
}
