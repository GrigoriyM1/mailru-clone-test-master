import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe, Put, Query, UnauthorizedException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto'
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { AddAdditionalDto } from './dto/add-additional.dto';
import { TimeFrame } from './utils/getTimeFrame';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Auth()
  @Get()
  async getAll(
    @Query('category') category: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
    @Query('skipAnswer') skipAnswer: string = '0',
    @Query('takeAnswer') takeAnswer: string = '20',
  ) {
    return this.questionService.getAll(category, Number(skip), Number(take), Number(skipAnswer), Number(takeAnswer));
  }

  @Auth()
  @Get('get-one/:id')
  async getOne(
    @Param('id') id: string,
    @Query('skipAnswer') skipAnswer: string = '0',
    @Query('takeAnswer') takeAnswer: string = '20',
  ) {
    return this.questionService.getOne(id, Number(skipAnswer), Number(takeAnswer));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: QuestionDto, @CurrentUser('id') userId: string) {
    return this.questionService.create(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(
    @Body() dto: Partial<QuestionDto>,
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.questionService.update(dto, id, userId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Delete(':id')
  async delete(
    @CurrentUser('isVip') isVip: boolean, 
    @CurrentUser('isAdmin') isAdmin: boolean, 
    @Param('id') id: string
  ) {
    if (!isVip) {
      if (!isAdmin) {
        throw new UnauthorizedException('У вас нет Vip подписки')
      }
    };
    return this.questionService.delete(id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Patch('like/:id')
  async like(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.questionService.like(id, userId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Patch('add-additional/:id')
  async addAdditional(
    @Body() dto: AddAdditionalDto,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.questionService.addAdditional(dto, id, userId);
  }

  @Auth()
  @Get('categories')
  async getCategories() {
    return this.questionService.getCategories();
  }

  @Auth()
  @Get('leaders')
  async getLeaders(
    @Query('category') category: string | undefined,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.questionService.getLeaders(category, Number(skip), Number(take))
  }

  @Auth()
  @Get('user/:userId/:category')
  async getFromUser(
    @Param('userId') userId: string,
    @Param('category') category: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.questionService.getFromUser(userId, category, Number(skip), Number(take))
  }

  @Auth()
  @Get('search/:searchText')
  async search(
    @Param('searchText') searchText: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
    @Query('category') category: string = '',
    @Query('subcategory') subcategory: string = '',
    @Query('time') time: TimeFrame = '',
    @Query('type') type: 'all' | 'resolve' = 'all',
    @Query('order') order: 'relevance' | 'date' = 'relevance',
  ) {
    return this.questionService.search(
      searchText, 
      category, 
      subcategory, 
      time, 
      type,
      order,
      Number(skip), 
      Number(take)
    )
  }

  @Auth()
  @Post('/make-leader/:id')
  async makeLeader(
    @Param('id') id: string,
    @CurrentUser('isVip') isVip: boolean,
  ) {
    if (!isVip) throw new UnauthorizedException('У вас нет Vip подписки');
    return this.questionService.makeLeader(id)
  }
}