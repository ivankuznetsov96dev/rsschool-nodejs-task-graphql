import { GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import { UserType } from "../types/user.js";
import { CreateUserInput } from "../inputs/create-user-input.js";
import { UserRow } from "../interfaces/user-row.interface.js";
import { GqlContext } from "../interfaces/gql-context.interface.js";
import { ProfileType } from "../types/profile.js";
import { CreateProfileInput } from "../inputs/create-profile-input.js";
import { ProfileRow } from "../interfaces/profile-row.interface.js";
import { PostType } from "../types/post.js";
import { CreatePostInput } from "../inputs/create-post-input.js";
import { PostRow } from "../interfaces/post-row.interface.js";
import { MemberTypeId } from "../interfaces/member-type-id.enum.js";
import { UUIDType } from "../types/uuid.js";
import { ChangePostInput } from "../inputs/change-post-input.js";
import { ChangeProfileInput } from "../inputs/change-profile-input.js";
import { ChangeUserInput } from "../inputs/change-user-input.js";

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: { 
        dto: { 
          type: new GraphQLNonNull(CreateUserInput)
        }
      },
      resolve: async (_src, { dto }: { dto: { name: string; balance: number }}, ctx: GqlContext) =>
        (ctx.prisma.user.create({ data: dto }) as Promise<UserRow>),
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput)
        }
      },
      resolve: async (_src, { dto }: { dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: MemberTypeId }}, ctx: GqlContext) =>
        (ctx.prisma.profile.create({ data: dto }) as Promise<ProfileRow>),
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInput)
        }
      },
      resolve: async (_src, { dto }: { dto: { title: string; content: string; authorId: string }}, ctx: GqlContext) =>
        (ctx.prisma.post.create({ data: dto }) as Promise<PostRow>),
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
        dto: {
          type: new GraphQLNonNull(ChangePostInput)
        },
      },
      resolve: async (_src, { id, dto }: { id: string; dto: { title?: string; content?: string }}, ctx: GqlContext) =>
        (ctx.prisma.post.update({ where: { id }, data: dto }) as Promise<PostRow>),
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
        dto: {
          type: new GraphQLNonNull(ChangeProfileInput)
        },
      },
      resolve: async (_src, { id, dto }: { id: string; dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: string }}, ctx: GqlContext) =>
        (ctx.prisma.profile.update({ where: { id }, data: dto }) as Promise<ProfileRow>),
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
        dto: {
          type: new GraphQLNonNull(ChangeUserInput)
        },
      },
      resolve: async (_src, { id, dto }: { id: string; dto: { name?: string; balance?: number } }, ctx: GqlContext) =>
        (ctx.prisma.user.update({ where: { id }, data: dto }) as Promise<UserRow>),
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: async (_src, { id }: { id: string }, ctx: GqlContext) => {
        await ctx.prisma.user.delete({ where: { id } });
        return 'ok';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: async (_src, { id }: { id: string }, ctx: GqlContext) => {
        await ctx.prisma.post.delete({ where: { id } });
        return 'ok';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: async (_src, { id }: { id: string }, ctx: GqlContext) => {
        await ctx.prisma.profile.delete({ where: { id } });
        return 'ok';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
      },
      resolve: async (_src, { userId, authorId }: { userId: string; authorId: string }, ctx: GqlContext) => {
        await ctx.prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return 'ok';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        },
      },
      resolve: async (_src, { userId, authorId }: { userId: string; authorId: string }, ctx: GqlContext) => {
        await ctx.prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId: userId, authorId } },
        });
        return 'ok';
      },
    },
  },
});