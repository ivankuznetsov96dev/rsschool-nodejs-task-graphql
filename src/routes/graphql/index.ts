import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLSchema,
  GraphQLScalarType,
  parse as gqlParse,
  validate,
  execute,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import type { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { Mutations } from './resolvers/mutation.js';
import { RootQuery } from './resolvers/query.js';
import { createLoaders } from './context.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const prisma: PrismaClient = fastify.prisma;

  const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
    types: [UUIDType as GraphQLScalarType],
  });
  

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    
    async handler(req) {
      const loaders = createLoaders(prisma);
      const contextValue = { prisma, loaders, loadersList: loaders };

      const document = gqlParse(req.body.query);
      const validationErrors = validate(schema, document, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await execute({
        schema,
        document,
        contextValue,
        variableValues: req.body.variables,
      });

      return result;
    },
  });
};

export default plugin;