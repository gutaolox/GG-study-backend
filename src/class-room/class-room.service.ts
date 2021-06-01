import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  create(createClassRoomDto: CreateClassRoomDto, clientId: string) {
    const createdClassRoom = new this.classRoomModel();
    createdClassRoom._id = Types.ObjectId();
    createdClassRoom.professor = {
      user: Types.ObjectId(createClassRoomDto.professorId),
      clientId,
    };
    createdClassRoom.name = createClassRoomDto.name;
    return createdClassRoom.save();
  }

  findAll() {
    return this.classRoomModel.find().exec();
  }

  findOne(id: number) {
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

  remove(id: number) {
    return `This action removes a #${id} classRoom`;
  }
}
