import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AdminGuard } from '../../common/admin.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Returns every submitter's personal details — admin only.
  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Patch(':id/read')
  @UseGuards(AdminGuard)
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
