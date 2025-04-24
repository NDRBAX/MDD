import { Post } from "../../interfaces/post.interface";
import { Comment } from "./comment.interface";

export interface PostDetailData extends Post {
  topic: string;
  comments: Comment[];
}
