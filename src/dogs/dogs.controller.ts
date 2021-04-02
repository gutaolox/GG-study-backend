import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dog } from './entities/dog.entity';

@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Dog' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDogDto: CreateDogDto) {
    return this.dogsService.create(createDogDto);
  }
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [Dog],
  })
  @Get()
  findAll() {
    return this.dogsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Dog,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) {
    return this.dogsService.update(+id, updateDogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dogsService.remove(+id);
  }
}
