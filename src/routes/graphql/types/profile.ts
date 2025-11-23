import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType } from "./member-type.js";
import { ProfileRow } from "../interfaces/profile-row.interface.js";
import { GqlContext } from "../interfaces/gql-context.interface.js";

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: ProfileRow, _args: unknown, ctx: GqlContext) => {
        return ctx.loaders.memberTypeLoader.load(source.memberTypeId);
      },
    },
  }),
});