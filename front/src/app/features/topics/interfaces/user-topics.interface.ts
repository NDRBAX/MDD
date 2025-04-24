import { Subscription } from "@core/interfaces/subscription.interface";
import { Topic } from "./topic.interface";


export interface UserTopicsData {
  topics: Topic[];
  subscriptions: Subscription[];
}
