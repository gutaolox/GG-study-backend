import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Message } from 'src/message/entities/message.entity';
import { ConnectedStudent } from './dto/connected-student.dto';
import { CreateClassRoomDto } from './dto/create-class-room.dto';
import { UpdateClassRoomDto } from './dto/update-class-room.dto';
import { ClassRoom, ClassRoomDocument } from './entities/class-room.entity';

@Injectable()
export class ClassRoomService {
  constructor(
    @InjectModel(ClassRoom.name)
    private classRoomModel: Model<ClassRoomDocument>,
  ) {}

  findAll() {
    return this.classRoomModel.find().exec();
  }

  findOne(id: number | string) {
    return this.classRoomModel.findById(id).exec();
  }

  update(id: number, updateClassRoom: ClassRoom) {
    return this.classRoomModel.updateOne({ _id: id }, updateClassRoom);
  }

  async addStudent(idClient: string, addInfo: ConnectedStudent) {
    const onlineClass = await this.findOne(addInfo.idClass);
    onlineClass.students.push({
      user: Types.ObjectId(addInfo.idStudent),
      clientId: idClient,
    });
    onlineClass.save();
  }

  async setClassState(idClass: number, inClass: boolean, clientId: string) {
    const onlineClass = await this.findOne(idClass);
    onlineClass.inClass = inClass;
    onlineClass.professor.clientId = clientId;
    onlineClass.save();
    return onlineClass;
  }

  remove(id: number) {
    return `This action removes a #${id} classRoom`;
  }
}
