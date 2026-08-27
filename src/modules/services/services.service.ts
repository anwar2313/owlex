import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  findAll() {
    return this.prisma.service.findMany({ orderBy: { order: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  update(id: number, dto: Partial<CreateServiceDto>) {
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.service.delete({ where: { id } });
  }
}
