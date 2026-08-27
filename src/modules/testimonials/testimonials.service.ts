import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  findAll() {
    return this.prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.testimonial.findUnique({ where: { id } });
  }

  update(id: number, dto: Partial<CreateTestimonialDto>) {
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
