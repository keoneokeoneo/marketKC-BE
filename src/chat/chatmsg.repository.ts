import { EntityRepository, Repository } from 'typeorm';
import { ChatMsg } from './chatmsg.entity';

@EntityRepository(ChatMsg)
export class ChatMsgRepository extends Repository<ChatMsg> {}
