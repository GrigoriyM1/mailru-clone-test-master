import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '../prisma.service';
import { EditProfileDto } from './dto/edit-profile.dto';
import { EditProfilePageDto } from './dto/edit-profile-page.dto';
import { GetLeadersType } from './types/get-leaders.types';
import { getLevel } from './lib/get-level';
import { MIN_USER } from '../user/constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getAll(page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const total = await this.prisma.user.count();
    const data = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { data, total };
  }

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: EditProfileDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      }
    })
  }
  getByLinkedEmail(linkedEmail: string) {
    return this.prisma.user.findUnique({
      where: {
        linkedEmail,
      }
    })
  }

  async create(dto: RegisterDto) {
    const user = {
      ...dto,
      password: await hash(dto.password)
    }

    return this.prisma.user.create({
      data: user
    })
  }

  async editProfile(dto: EditProfileDto, userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        description: dto.description.trim()
      }
    })
  }

  async editProfilePage(dto: EditProfilePageDto, userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: dto.name.trim(),
        lastName: dto.lastName.trim(),
        birthdate: dto.birthdate.trim(),
        gender: dto.gender.trim()
      }
    })
  }

  async editProfileAvatar(file: Express.Multer.File, userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: `${process.env.SERVER_URL}/uploads/${file.filename}`
      }
    })
    return true
  }

  async getLeaders(
    type: GetLeadersType, 
    skip: number, 
    take: number,
  ) {
    return this.prisma.user.findMany({
      // where: {},
      orderBy: type === 'activity' ? {
        points: 'desc'
      } : {
        answers: {
          _count: 'desc',
        }
      },
      select: {
        ...MIN_USER,
        points: true,
        level: true,
        _count: {
          select: {
            answers: true,
          }
        }
      },
      skip,
      take,
    })
  }

  async addPoints(userId: string, points: number, type: 'increment' | 'decrement' = 'increment') {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: user.points <= 0 ? {} : {
        points: {
          [type]: points
        }
      }
    })

    if (getLevel(updatedUser.points) !== updatedUser.level) {
      await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          level: getLevel(updatedUser.points) 
        }
      })
    }

    return updatedUser
  }

  async updateSubscriptionStatus(userId: string, isVip: boolean) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isVip
      }
    })
  }
}
