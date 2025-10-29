import type { User } from "../users/types";

export type Session = {
  id: string;
  secretHash: string;
  userId: string;
  user: User;
};
