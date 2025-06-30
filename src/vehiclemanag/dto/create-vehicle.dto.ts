import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
enum Category {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  SUV = 'SUV',
}

export class CreateVehicleDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  pricePerHour: number;

  @IsEnum(Category)
  category: Category;

  @IsString()
  location: string;

  @IsString()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
