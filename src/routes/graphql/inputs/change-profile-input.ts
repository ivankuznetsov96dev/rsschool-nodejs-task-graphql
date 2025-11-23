import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { MemberTypeEnum } from "../types/member-type.js";

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {
      type: GraphQLBoolean
    },
    yearOfBirth: {
      type: GraphQLInt
    },
    memberTypeId: {
      type: MemberTypeEnum
    },
  },
});