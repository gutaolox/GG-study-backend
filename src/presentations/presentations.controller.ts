import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Request, Response } from 'express';
import * as path from 'path';
import { Public } from 'src/metadata.definition';
import * as fs from 'fs';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) {}

  @Post()
  create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationsService.create(createPresentationDto);
  }

  @Get()
  findAll() {
    return this.presentationsService.findAll();
  }

  @Get(':id/:page')
  @Public()
  findOne(
    @Res() response: Response,
    @Req() request: Request,
    @Param('id') classId: string,
    @Param('page') page: string,
  ) {
    const base64Image = fs
      .readFileSync(path.resolve(`presentation/${classId}/Slide${page}.jpg`))
      .toString('base64');
    response.send(base64Image);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return this.presentationsService.update(+id, updatePresentationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentationsService.remove(+id);
  }
}
