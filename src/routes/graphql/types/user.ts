import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import { UserRow } from "../interfaces/user-row.interface.js";
import { GqlContext } from "../interfaces/gql-context.interface.js";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";

export const UserType: GraphQLObjectType<UserRow, GqlContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    profile: {
      type: ProfileType,
      resolve: async (source: UserRow, _args: unknown, ctx: GqlContext) => {
        if (source.profile) {
          return source.profile;
        }
        return ctx.loaders.profileLoader.load(source.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (source: UserRow, _args: unknown, ctx: GqlContext) => {
        return ctx.loaders.postsLoader.load(source.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source: UserRow, _args: unknown, ctx: GqlContext) => {
        if (Array.isArray(source.userSubscribedTo)) {
          return source.userSubscribedTo.map((item) => {
            if ('author' in item && (item as { author?: UserRow }).author) {
              return (item as { author?: UserRow }).author as UserRow;
            }
            return item as UserRow;
          });
        }
        const rows = await ctx.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: { subscriberId: source.id },
            },
          },
        });
        return rows as UserRow[];
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source: UserRow, _args: unknown, ctx: GqlContext) => {
        if (Array.isArray(source.subscribedToUser)) {
          return source.subscribedToUser.map((item) => {
            if ('subscriber' in item && (item as { subscriber?: UserRow }).subscriber) {
              return (item as { subscriber?: UserRow }).subscriber as UserRow;
            }
            return item as UserRow;
          });
        }
        const rows = await ctx.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: { authorId: source.id },
            },
          },
        });
        return rows as UserRow[];
      },
    },
  }),
});