import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Res, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ReportDto } from './dto/report.dto';
import { ReportService } from './report.service';
import { Response } from 'express';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Auth()
  @Get()
  async getAll(
    @CurrentUser('isAdmin') isAdmin: boolean,
    @Query('page') page: string, 
    @Query('perPage') perPage: string, 
    @Res() res: Response
  ) {
    if (!isAdmin) throw new UnauthorizedException('Вы не являетесь админом');

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    const { data, total } = await this.reportService.getAll(pageNumber, itemsPerPage);

    res.set('Content-Range', `tests ${((pageNumber - 1) * itemsPerPage)}-${(pageNumber * itemsPerPage) - 1}/${total}`);
    res.json(data);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: ReportDto) {
    return this.reportService.create(dto);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @CurrentUser('isAdmin') isAdmin: boolean, 
    @Param('id') id: string
  ) {
    if (!isAdmin) throw new UnauthorizedException('Вы не являетесь админом');
    return this.reportService.delete(id);
  }
}
