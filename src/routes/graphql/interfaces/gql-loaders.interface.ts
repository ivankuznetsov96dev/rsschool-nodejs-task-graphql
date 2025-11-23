import DataLoader from 'dataloader';
import { PostRow } from './post-row.interface.js';
import { MemberTypeRow } from './member-type-row.interface.js';
import { ProfileRow } from './profile-row.interface.js';
import { UserRow } from './user-row.interface.js';

export interface GqlLoaders {
  postsLoader: DataLoader<string, PostRow[]>;
  memberTypeLoader: DataLoader<string, MemberTypeRow | null>;
  profileLoader: DataLoader<string, ProfileRow | null>;
  usersByIdLoader: DataLoader<string, UserRow | null>;
};