import { GraphQLInputObjectType, GraphQLNonNull, GraphQLScalarType, GraphQLString } from "graphql";
import { UUIDType } from "../types/uuid.js";

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType as GraphQLScalarType)
    },
  },
});