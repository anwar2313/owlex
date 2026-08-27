import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTechStackItemDto } from './dto/create-tech-stack-item.dto';

@Injectable()
export class TechStackService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTechStackItemDto) {
    return this.prisma.techStackItem.create({ data: dto });
  }

  findAll() {
    return this.prisma.techStackItem.findMany({
      orderBy: { order: 'asc' },
    });
  }

  findFeatured() {
    return this.prisma.techStackItem.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.techStackItem.findUnique({ where: { id } });
  }

  update(id: number, dto: Partial<CreateTechStackItemDto>) {
    return this.prisma.techStackItem.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.techStackItem.delete({ where: { id } });
  }
}
