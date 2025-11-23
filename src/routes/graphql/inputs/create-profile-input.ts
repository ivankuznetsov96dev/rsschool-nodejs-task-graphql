import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLScalarType } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { MemberTypeEnum } from "../types/member-type.js";

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    userId: {
      type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeEnum)
    },
  },
});