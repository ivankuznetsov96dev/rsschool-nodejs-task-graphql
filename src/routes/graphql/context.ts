import type { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { PostRow } from './interfaces/post-row.interface.js';
import { MemberTypeRow } from './interfaces/member-type-row.interface.js';
import { ProfileRow } from './interfaces/profile-row.interface.js';
import { UserRow } from './interfaces/user-row.interface.js';

export function createLoaders(prisma: PrismaClient) {
  const postsLoader = new DataLoader<string, PostRow[]>(async (keys) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: keys as string[]
        },
      },
    });

    const map = new Map<string, PostRow[]>();

    for (const k of keys as string[]) {
      map.set(k, []);
    }

    for (const p of posts) {
      const arr = map.get(p.authorId) ?? [];
      arr.push(p);
      map.set(p.authorId, arr);
    }

    return (keys as string[]).map((k) => map.get(k) ?? []);
  });

  const memberTypeLoader = new DataLoader<string, MemberTypeRow | null>(async (keys) => {
    const rows = await prisma.memberType.findMany({
      where: {
        id: {
          in: keys as string[]
        }
      },
    });
    const map = new Map(rows.map((r) => [r.id, r]));

    return (keys as string[]).map((k) => map.get(k) ?? null);
  });


  const profileLoader = new DataLoader<string, ProfileRow | null>(async (keys) => {
    const rows = await prisma.profile.findMany({
      where: { userId: { in: keys as string[] } },
    }) as ProfileRow[];
    const map = new Map<string, ProfileRow>();

    for (const r of rows) {
      map.set(r.userId, r);
    }

    return (keys as string[]).map((k) => map.get(k) ?? null);
  });

  const usersByIdLoader = new DataLoader<string, UserRow | null>(async (keys) => {
    const rows = await prisma.user.findMany({
      where: {
        id: {
          in: keys as string[]
        }
      },
    });
    const map = new Map(rows.map((r) => [r.id, r]));
    
    return (keys as string[]).map((k) => map.get(k) ?? null);
  });

  return {
    postsLoader,
    memberTypeLoader,
    profileLoader,
    usersByIdLoader,
  };
}