import { Authorization } from "./authorization.interface";
import { User } from "./user.interface";

export interface SessionInformation {
  authorization: Authorization;
  user: User;
}
