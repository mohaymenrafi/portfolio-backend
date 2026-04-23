import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  findPublished() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findOne(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return post;
  }

  async create(dto: CreatePostDto) {
    const { tags, ...data } = dto;
    return this.prisma.post.create({
      data: {
        ...data,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findById(id);
    const { tags, ...data } = dto;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.post.delete({ where: { id } });
  }

  private async findById(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }
}
