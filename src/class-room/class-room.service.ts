import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
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

  findAllByStudent(idStudent: string) {
    return this.classRoomModel
      .find({ students: Types.ObjectId(idStudent), inClass: true })
      .exec();
  }

  findAllByProfessor(id: number | string) {
    return this.classRoomModel
      .find({
        'professor.user': Types.ObjectId(id),
      })
      .exec();
  }

  findOne(id: number | string) {
    return this.classRoomModel.findById(id).exec();
  }

  findOneNoExec(id: number | string) {
    return this.classRoomModel.findById(id);
  }

  update(id: number, updateClassRoom: ClassRoom) {
    return this.classRoomModel.updateOne({ _id: id }, updateClassRoom);
  }

  async addStudent(idClient: string, addInfo: ConnectedStudent) {
    const onlineClass = await this.findOne(addInfo.idClass);
    if (
      onlineClass.onlineStudents.some(
        (x) => x.user == Types.ObjectId(addInfo.idStudent),
      )
    ) {
      return null;
    }
    onlineClass.onlineStudents.push({
      user: Types.ObjectId(addInfo.idStudent),
      clientId: idClient,
    });

    return onlineClass.save();
  }

  async removeStudent(idClient: string, addInfo: ConnectedStudent) {
    const onlineClass = await this.findOne(addInfo.idClass);
    onlineClass.onlineStudents = onlineClass.onlineStudents.filter(
      (x) => x.user != Types.ObjectId(addInfo.idStudent),
    );
    return onlineClass.save();
  }

  async setClassState(idClass: number, inClass: boolean, clientId: string) {
    const onlineClass = await this.findOne(idClass);
    onlineClass.inClass = inClass;
    if (inClass) {
      onlineClass.page = 1;
    } else {
      onlineClass.onlineStudents = [];
    }
    onlineClass.save();
    return onlineClass;
  }

  async setPage(idClass: string | number, newPage: number) {
    const onlineClass = await this.findOne(idClass);
    onlineClass.page = newPage;
    onlineClass.save();
  }

  remove(id: number) {
    return `This action removes a #${id} classRoom`;
  }

  async findAllOnlineStudentsByClass(id: number | string) {
    const onlineClass = await this.findOneNoExec(id).exec();

    return onlineClass.onlineStudents;
  }
}
