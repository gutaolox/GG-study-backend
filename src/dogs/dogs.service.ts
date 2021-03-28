import {Injectable} from '@nestjs/common';
import {CreateDogDto} from './dto/create-dog.dto';
import {UpdateDogDto} from './dto/update-dog.dto';
import {Dog, DogDocument} from "./entities/dog.entity";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class DogsService {
    constructor(@InjectModel(Dog.name) private catModel: Model<DogDocument>) {
    }

    async create(createDogDto: CreateDogDto): Promise<Dog> {
        const createdDog = new this.catModel(createDogDto);
        return createdDog.save();
    }

    async findAll(): Promise<Dog[]> {
        return this.catModel.find().exec();
    }

    findOne(id: number) {
        return `This action returns a #${id} dog`;
    }

    update(id: number, updateDogDto: UpdateDogDto) {
        return `This action updates a #${id} dog`;
    }

    remove(id: number) {
        return `This action removes a #${id} dog`;
    }
}
