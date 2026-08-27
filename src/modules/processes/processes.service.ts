import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcessStepDto } from './dto/create-process-step.dto';

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProcessStepDto) {
    return this.prisma.processStep.create({ data: dto });
  }

  findAll() {
    return this.prisma.processStep.findMany({
      orderBy: { stepNumber: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.processStep.findUnique({ where: { id } });
  }

  update(id: number, dto: Partial<CreateProcessStepDto>) {
    return this.prisma.processStep.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.processStep.delete({ where: { id } });
  }
}
