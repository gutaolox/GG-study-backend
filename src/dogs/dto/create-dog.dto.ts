import { ApiProperty } from '@nestjs/swagger';

export class CreateDogDto {
  @ApiProperty({ example: 'Zé', description: 'The name of the Dog' })
  name: string;
  @ApiProperty({ example: 1, description: 'The age of the Dog' })
  age: number;
  @ApiProperty({ example: 'pug', description: 'The breed of the Dog' })
  breed: string;
}
