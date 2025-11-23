import { PostRow } from "./post-row.interface.js";
import { ProfileRow } from "./profile-row.interface.js";

export interface UserRow {
  id: string;
  name: string;
  balance: number;
  profile?: ProfileRow | null;
  posts?: PostRow[];
  userSubscribedTo?: Array<{ author?: UserRow } | UserRow> | null;
  subscribedToUser?: Array<{ subscriber?: UserRow } | UserRow> | null;
};