import { EntityRepository, Repository } from 'typeorm';
import { ChatUser } from './chatuser.entity';

@EntityRepository(ChatUser)
export class ChatUserRepository extends Repository<ChatUser> {}
