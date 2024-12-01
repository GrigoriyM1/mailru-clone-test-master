import { Injectable } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService
  ) {}

  async getAll(page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const total = await this.prisma.report.count();
    const data = await this.prisma.report.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { data, total };
  }

  async create(dto: ReportDto) {
    const isExists = await this.prisma.report.findFirst({
      where: {
        elementId: dto.elementId,
        type: dto.type,
      },
    });
    if (isExists) return true;

    await Promise.all([
      this.mailerService.sendMail({
        from: '"No Reply" <otpravka92@mail.ru>',
        to: 'otpravka92@mail.ru',
        subject: 'New report',
        text: `
          Новый репорт на ${dto.type === 'QUESTION' ? 'вопрос': 'ответ'} \n\n
          ${dto.elementLink} \n
          Заголовок: ${dto.title} \n 
          ${dto.description ? `Текст: ${dto.description}` : ''}
        `,
        html: `
          <div>
            <h1>Новый репорт на ${dto.type === 'QUESTION' ? 'вопрос': 'ответ'}</h1>
            <a href="${dto.elementLink}" style="display: block; width: 100%;">${dto.elementLink}</a>
            <h2>Заголовок: ${dto.title}</h2>
            ${dto.description ? `<h4>Текст: ${dto.description}</h4>` : ''}
          </div>
        `,
      }),
      this.prisma.report.create({
        data: dto,
      })
    ])
    return true
  }

  async delete(id: string) {
    return this.prisma.report.delete({
      where: { id },
    });
  }
}
