import { GqlLoaders } from "./gql-loaders.interface.js";
import type { PrismaClient } from '@prisma/client';

export interface GqlContext {
  prisma: PrismaClient;
  loaders: GqlLoaders;
  loadersList?: GqlLoaders;
};