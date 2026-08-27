import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    // Save to DB
    const submission = await this.prisma.contactSubmission.create({
      data: dto,
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    this.mail
      .sendContactNotification(dto)
      .catch((err: unknown) =>
        this.logger.error(
          'Failed to send contact email',
          err instanceof Error ? err.message : String(err),
        ),
      );

    return submission;
  }

  findAll() {
    return this.prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.contactSubmission.findUnique({ where: { id } });
  }

  markAsRead(id: number) {
    return this.prisma.contactSubmission.update({
      where: { id },
      data: { read: true },
    });
  }

  remove(id: number) {
    return this.prisma.contactSubmission.delete({ where: { id } });
  }
}
