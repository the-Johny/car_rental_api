import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// Import the Prisma Category enum
import { Category } from '../../generated/prisma';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateVehicleDto) {
    // Map the category to the Prisma enum
    const prismaData = {
      ...data,
      category: data.category as Category,
    };
    return this.prisma.vehicle.create({ data: prismaData });
  }

  findAll() {
    return this.prisma.vehicle.findMany({ include: { features: true } });
  }

  findOne(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { features: true },
    });
  }

  update(id: string, data: UpdateVehicleDto) {
    const { category, ...rest } = data;
    const prismaData = {
      ...rest,
      ...(category !== undefined && {
        category: { set: category as Category },
      }),
    };
    return this.prisma.vehicle.update({ where: { id }, data: prismaData });
  }

  remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
