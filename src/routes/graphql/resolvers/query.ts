import {
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
} from 'graphql';
import { MemberType, MemberTypeEnum } from '../types/member-type.js';
import { UserType } from '../types/user.js';
import { PostType } from '../types/post.js';
import { ProfileType } from '../types/profile.js';
import { GqlContext } from '../interfaces/gql-context.interface.js';
import { UserRow } from '../interfaces/user-row.interface.js';
import { MemberTypeRow } from '../interfaces/member-type-row.interface.js';
import { ProfileRow } from '../interfaces/profile-row.interface.js';
import { PostRow } from '../interfaces/post-row.interface.js';
import { UUIDType } from '../types/uuid.js';


export const RootQuery: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_src, _args, ctx: GqlContext) => ctx.prisma.memberType.findMany() as Promise<MemberTypeRow[]>,
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeEnum)
        }
      },
      resolve: async (_src, args: { id: string }, ctx: GqlContext) =>
        ctx.prisma.memberType.findUnique({ where: { id: args.id } }) as Promise<MemberTypeRow | null>,
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_src, _args, ctx: GqlContext) => ctx.prisma.user.findMany({
        include: {
          profile: true,
          userSubscribedTo: {
            include: {
              author: true
            }
          },
          subscribedToUser: {
            include: {
              subscriber: true
            }
          },
        },
      }) as Promise<UserRow[]>,
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: (_src, args: { id: string }, ctx: GqlContext) => ctx.prisma.user.findUnique({
        where: {
          id: args.id
        },
        include: {
          profile: true,
          userSubscribedTo: {
            include: {
              author: true
            }
          },
          subscribedToUser: {
            include: {
              subscriber: true
            }
          },
        },
      }) as Promise<UserRow | null>,
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_src, _args, ctx: GqlContext) => ctx.prisma.post.findMany() as Promise<PostRow[]>,
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: async (_src, args: { id: string }, ctx: GqlContext) => ctx.prisma.post.findUnique({ where: { id: args.id } }) as Promise<PostRow | null>,
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_src, _args, ctx: GqlContext) => ctx.prisma.profile.findMany() as Promise<ProfileRow[]>,
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
        }
      },
      resolve: async (_src, args: { id: string }, ctx: GqlContext) => ctx.prisma.profile.findUnique({ where: { id: args.id } }) as Promise<ProfileRow | null>,
    },
  },
} as GraphQLObjectTypeConfig<unknown, GqlContext>);