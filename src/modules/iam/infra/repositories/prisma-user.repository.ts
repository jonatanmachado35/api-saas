import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { Role as PrismaRole } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(user: any): User {
    return new User(
      {
        email: user.email,
        password: user.password,
        googleId: user.google_id,
        githubId: user.github_id,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role as UserRole,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      user.id,
    );
  }

  async save(user: User): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({ where: { id: user.id } });

    const data = {
      id: user.id,
      email: user.email,
      password: user.password,
      google_id: user.googleId,
      github_id: user.githubId,
      full_name: user.fullName,
      avatar_url: user.avatarUrl,
      role: user.role as PrismaRole,
    };

    if (existingUser) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: data.email,
          password: data.password,
          google_id: data.google_id,
          github_id: data.github_id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role,
        },
      });
    } else {
      // Create new user with subscription
      await this.prisma.user.create({
        data: {
          ...data,
          subscription: {
            create: {
              plan: 'FREE',
              status: 'ACTIVE',
              credits: 50,
            },
          },
        },
      });
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { google_id: googleId } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { github_id: githubId } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    return users.map((u) => this.toDomain(u));
  }
}
