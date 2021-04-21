import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateClassRoomDto } from './dto/create-class-room.dto';
import { UpdateClassRoomDto } from './dto/update-class-room.dto';
import { ClassRoom, ClassRoomDocument } from './entities/class-room.entity';

@Injectable()
export class ClassRoomService {
  constructor(
    @InjectModel(ClassRoom.name)
    private classRoomModel: Model<ClassRoomDocument>,
  ) {}
  create(createClassRoomDto: CreateClassRoomDto, clientId: string) {
    const createdClassRoom = new this.classRoomModel();
    createdClassRoom._id = Types.ObjectId();
    createdClassRoom.professor = {
      user: Types.ObjectId(createClassRoomDto.professorId),
      clientId,
    };
    return createdClassRoom.save();
  }

  async findAll() {
    return await this.classRoomModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} classRoom`;
  }

  update(id: number, updateClassRoomDto: UpdateClassRoomDto) {
    return `This action updates a #${id} classRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} classRoom`;
  }
}
