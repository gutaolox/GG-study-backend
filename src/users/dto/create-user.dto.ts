import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ example: 'gutaolox@gmail.com', description: 'The username' })
  username: string;
  @ApiProperty({ example: '*****', description: 'The secret password' })
  password: string;
  @ApiProperty({ example: 'student', description: 'The user Role' })
  role: string;
  @ApiProperty({ example: 'Gustavo Motta', description: 'The user name' })
  name: string;
}
