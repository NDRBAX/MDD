import { User } from '@core/interfaces/user.interface';
import { Topic } from "../../topics/interfaces/topic.interface";

export interface UserProfileData {
  user: User;
  topics: Topic[];
}
