import { GetByEmailDto } from './dto/get-by-email.dto';
import { Body, Controller, HttpCode, Post, Get, Param, Patch, UploadedFile, Query, UnauthorizedException, Res, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EditProfileDto } from './dto/edit-profile.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { EditProfilePageDto } from './dto/edit-profile-page.dto';
import { FileUpload } from '../files/decorators/files.decorator';
import { GetLeadersType } from './types/get-leaders.types';
import { Response } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
    const { data, total } = await this.userService.getAll(pageNumber, itemsPerPage);

    res.set('Content-Range', `tests ${((pageNumber - 1) * itemsPerPage)}-${(pageNumber * itemsPerPage) - 1}/${total}`);
    res.json(data);
  }

  @Post('get-by-email')
  @HttpCode(200)
  async getByEmail(
    @Body() { email }: GetByEmailDto
  ) {
    const data = await this.userService.getByEmail(email)
    return data ? true : false
  }

  @Get('get-by-id/:id') // из за этого leaders не берется 
  @Auth()
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    const data = await this.userService.getById(id)
    return data
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: EditProfileDto) {
    return this.userService.update(id, dto)
  }

  @Patch('edit-profile')
  @Auth()
  async editProfile(
    @Body() dto: EditProfileDto,
    @CurrentUser('id') userId: string, 
  ) {
    const data = await this.userService.editProfile(dto, userId)
    return data
  }

  @Patch('edit-profile-page')
  @Auth()
  async editProfilePage(
    @Body() dto: EditProfilePageDto,
    @CurrentUser('id') userId: string, 
  ) {
    const data = await this.userService.editProfilePage(dto, userId)
    return data
  }

  @Patch('edit-profile-avatar')
  @Auth()
  @FileUpload()
  async editProfileAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ) {
    return this.userService.editProfileAvatar(file, userId)
  }

  @Get('leaders')
  @Auth()
  async getLeaders(
    @Query('type') type: GetLeadersType = 'activity',
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.userService.getLeaders(type, Number(skip), Number(take))
  }
}
