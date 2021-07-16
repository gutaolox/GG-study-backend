import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    console.log('aaa', createQuestionDto);
    const createdQuestion = new this.questionModel(createQuestionDto);
    console.log('bbb', createdQuestion);
    createdQuestion._id = Types.ObjectId();
    //Regra de negocio
    console.log('create', createdQuestion);
    return createdQuestion.save();
  }

  async findByClass(idClass: string) {
    return await this.questionModel.find({ classRoom: idClass }).exec();
  }

  async findAll() {
    return await this.questionModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
