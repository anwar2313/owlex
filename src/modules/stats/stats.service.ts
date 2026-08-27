import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStatDto } from './dto/create-stat.dto';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateStatDto) {
    return this.prisma.stat.create({ data: dto });
  }

  findAll() {
    return this.prisma.stat.findMany({ orderBy: { order: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.stat.findUnique({ where: { id } });
  }

  update(id: number, dto: Partial<CreateStatDto>) {
    return this.prisma.stat.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.stat.delete({ where: { id } });
  }
}
