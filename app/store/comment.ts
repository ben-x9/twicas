import { User } from 'store/user';

export interface Comment {
  id: string;
  message: string;
  fromUser: User;
  created: number;
}