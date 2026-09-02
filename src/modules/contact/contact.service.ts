import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
    // The email is the part the business actually depends on, so a database
    // outage must not swallow the submission (and vice versa).
    let submission: { id: number } | null = null;
    let dbError: unknown = null;

    try {
      submission = await this.prisma.contactSubmission.create({ data: dto });
    } catch (err: unknown) {
      dbError = err;
      this.logger.error(
        `Failed to save contact submission: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    try {
      await this.mail.sendContactNotification(dto);
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send contact email: ${err instanceof Error ? err.message : String(err)}`,
      );

      // Nothing was stored and nothing was sent — the visitor must be told.
      if (dbError) {
        throw new InternalServerErrorException(
          'Could not deliver your message. Please email us directly.',
        );
      }
    }

    return submission ?? { ok: true };
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
