import { MemberTypeId } from "./member-type-id.enum.js";
import { MemberTypeRow } from "./member-type-row.interface.js";

export interface ProfileRow { 
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
  memberType?: MemberTypeRow;
};
