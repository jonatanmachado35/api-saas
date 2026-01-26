import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';

export interface GitHubLoginInput {
  github_token: string;
}

interface GitHubPayload {
  id: string;
  login: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

@Injectable()
export class GitHubLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: GitHubLoginInput) {
    const githubPayload = await this.verifyGitHubToken(input.github_token);
    if (!githubPayload) {
      throw new UnauthorizedException('Invalid GitHub token');
    }

    let user = await this.userRepository.findByGithubId(githubPayload.id);

    if (!user) {
      user = await this.userRepository.findByEmail(githubPayload.email);

      if (user) {
        // Link existing user with GitHub account
        const updatedUser = new User(
          {
            email: user.email,
            password: user.password,
            googleId: user.googleId,
            githubId: githubPayload.id,
            fullName: user.fullName || githubPayload.name,
            avatarUrl: user.avatarUrl || githubPayload.avatar_url,
            role: user.role,
          },
          user.id,
        );
        await this.userRepository.save(updatedUser);
        user = updatedUser;
      } else {
        // Create new user
        user = new User({
          email: githubPayload.email,
          githubId: githubPayload.id,
          fullName: githubPayload.name,
          avatarUrl: githubPayload.avatar_url,
          role: UserRole.USER,
        });
        await this.userRepository.save(user);
      }
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Buscar subscription do usuario
    const subscription = await this.prisma.subscription.findUnique({
      where: { user_id: user.id },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        avatar_url: user.avatarUrl,
        role: user.role,
        plan: subscription?.plan || 'FREE',
      },
      token,
    };
  }

  private async verifyGitHubToken(token: string): Promise<GitHubPayload | null> {
    try {
      const axios = require('axios');
      
      // Get user info from GitHub API
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      // If email is not public, fetch it separately
      let email = userResponse.data.email;
      if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        const primaryEmail = emailsResponse.data.find((e: any) => e.primary);
        email = primaryEmail?.email || emailsResponse.data[0]?.email;
      }

      if (!email) {
        throw new UnauthorizedException('GitHub account must have a verified email');
      }

      return {
        id: userResponse.data.id.toString(),
        login: userResponse.data.login,
        email,
        name: userResponse.data.name,
        avatar_url: userResponse.data.avatar_url,
      };
    } catch (error) {
      console.error('GitHub token verification failed:', error);
      return null;
    }
  }
}
